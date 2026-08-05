import cron from "node-cron";

import User from "../models/users.model"; 
import Codeforces from "../models/cfstats.model"; 
import LeetCode from "../models/lcstats.model";

import { getSub as getCFSub } from "./codeforces/fetch";
import { getSub as getLCSub } from "./leetcode/fetch";

import { getCFSolved, getLCSolved } from "./stats/calculateTotalsolved";
import { Submission } from "./stats/types";

const ONE_DAY = 24 * 60 * 60 * 1000;

const calculateTodaySolved = (submissions: Submission[]): number => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todaySolvedSet = new Set<string>();

    for (const sub of submissions) {
        if (sub.verdict !== "OK") continue;
        const subDate = new Date(sub.timestamp * 1000);
        if (subDate.getTime() >= today.getTime()) {
            todaySolvedSet.add(sub.problemID);
        }
    }
    return todaySolvedSet.size;
};

const syncCodeforces = async (user: any) => {
    try {
        if (!user.codeforces_username) return;

        let cfDoc = await Codeforces.findOne({ user: user._id });
        if (!cfDoc) cfDoc = new Codeforces({ user: user._id });

        const submissions = await getCFSub({
            username: user.codeforces_username,
            lastSolvedID: cfDoc.lastSubmissionId || null, 
        });

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayTime = today.getTime();
        const yesterdayTime = todayTime - ONE_DAY;

       
        if ((cfDoc.lastSolvedDay || 0) < todayTime) {
            cfDoc.todaySolved = 0;
        }

        if (submissions.length > 0) {
            cfDoc.totalSolved += getCFSolved(submissions);
            cfDoc.todaySolved += calculateTodaySolved(submissions);
            
            const chronologicalSubs = [...submissions].reverse();
            
            for (const sub of chronologicalSubs) {
                if (sub.verdict !== "OK") continue;
                
                const subDate = new Date(sub.timestamp * 1000);
                subDate.setHours(0, 0, 0, 0);
                const subDay = subDate.getTime();
                
                const currentLastDay = cfDoc.lastSolvedDay || 0;
                
                if (currentLastDay === 0) {
                    cfDoc.streak = 1;
                } else if (subDay === currentLastDay + ONE_DAY) {
                    cfDoc.streak += 1; 
                } else if (subDay > currentLastDay + ONE_DAY) {
                    cfDoc.streak = 1;
                }
                
                cfDoc.lastSolvedDay = subDay;
            }

            cfDoc.lastSubmissionId = Number(submissions[0].submissionID);
            console.log(`[Codeforces] Synced NEW data for ${user.codeforces_username}`);
        }
        if ((cfDoc.lastSolvedDay || 0) < yesterdayTime) {
            cfDoc.streak = 0; 
        }

        cfDoc.lastSyncedAt = new Date();
        await cfDoc.save();

    } catch (error) {
        console.error(`Error syncing Codeforces for ${user.codeforces_username}:`, error);
    }
};

const syncLeetCode = async (user: any) => {
    try {
        if (!user.leetcode_username) return;

        let lcDoc = await LeetCode.findOne({ user: user._id });
        if (!lcDoc) lcDoc = new LeetCode({ user: user._id });

        const submissions = await getLCSub({
            username: user.leetcode_username,
            lastSolvedID: lcDoc.lastSubmissionID || null, 
        });

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayTime = today.getTime();
        const yesterdayTime = todayTime - ONE_DAY;

        let lastDay = 0;
        if (lcDoc.lastSubmissionTime) {
            const lDate = new Date(lcDoc.lastSubmissionTime);
            lDate.setHours(0, 0, 0, 0);
            lastDay = lDate.getTime();
        }

        if (lastDay < todayTime) {
            lcDoc.todaySolved = 0;
        }

        if (submissions.length > 0) {
            lcDoc.totalSolved += getLCSolved(submissions);
            lcDoc.todaySolved += calculateTodaySolved(submissions);
            
            const chronologicalSubs = [...submissions].reverse();
            
            for (const sub of chronologicalSubs) {
                if (sub.verdict !== "OK") continue;
                
                const subDate = new Date(sub.timestamp * 1000);
                subDate.setHours(0, 0, 0, 0);
                const subDay = subDate.getTime();
                
                if (lastDay === 0) {
                    lcDoc.streak = 1;
                } else if (subDay === lastDay + ONE_DAY) {
                    lcDoc.streak += 1;
                } else if (subDay > lastDay + ONE_DAY) {
                    lcDoc.streak = 1;
                }
                
                lastDay = subDay;
            }

            lcDoc.lastSubmissionID = String(submissions[0].submissionID);
            lcDoc.lastSubmissionTime = new Date(submissions[0].timestamp * 1000);
            console.log(`[LeetCode] Synced NEW data for ${user.leetcode_username}`);
        }

        if (lastDay < yesterdayTime) {
            lcDoc.streak = 0;
        }

        lcDoc.lastSyncedAt = new Date();
        await lcDoc.save();

    } catch (error) {
        console.error(`Error syncing LeetCode for ${user.leetcode_username}:`, error);
    }
};

export const startPoller = () => {
    console.log("Starting the platform stats poller...");
    
    const runSync = async () => {
        console.log(`[${new Date().toISOString()}] Running scheduled sync...`);
        try {
            const users = await User.find({
                $or: [
                    { codeforces_username: { $exists: true, $ne: "" } },
                    { leetcode_username: { $exists: true, $ne: "" } }
                ]
            });
            for (const user of users) {
                await Promise.all([
                    syncCodeforces(user),
                    syncLeetCode(user)
                ]);
            }
            console.log("Sync completed successfully.");
        } catch (error) {
            console.error("Error during sync:", error);
        }
    };

    runSync();
    cron.schedule("* * * * *", runSync);
};