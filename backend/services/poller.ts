import cron from "node-cron";

import User from "../models/users.model"; 
import Codeforces from "../models/cfstats.model"; 
import LeetCode from "../models/lcstats.model";

import { createDailyArchive } from "../controller/archive.controller";

import { getSub as getCFSub } from "./codeforces/fetch";
import { getSub as getLCSub } from "./leetcode/fetch";

const ONE_DAY = 24 * 60 * 60 * 1000;

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
            const chronologicalSubs = [...submissions].reverse();
            let maxSafeId = cfDoc.lastSubmissionId || 0;
            let loggedUpdate = false;

            for (const sub of chronologicalSubs) {
                if (sub.verdict === "TESTING" || sub.verdict === "WAITING") {
                    break; 
                }

                if (sub.verdict === "OK") {
                    cfDoc.totalSolved += 1;
                    
                    const subDate = new Date(sub.timestamp * 1000);
                    subDate.setHours(0, 0, 0, 0);
                    const subDay = subDate.getTime();
                    
                    if (subDay === todayTime) {
                        cfDoc.todaySolved += 1;
                    }

                    const currentLastDay = cfDoc.lastSolvedDay || 0;
                    
                    if (currentLastDay === 0) {
                        cfDoc.streak = 1;
                    } else if (subDay === currentLastDay + ONE_DAY) {
                        cfDoc.streak += 1;
                    } else if (subDay > currentLastDay + ONE_DAY) {
                        cfDoc.streak = 1;
                    }
                    
                    cfDoc.lastSolvedDay = subDay;
                    loggedUpdate = true;
                }
                
            
                maxSafeId = Number(sub.submissionID);
            }

            cfDoc.lastSubmissionId = maxSafeId;
            
            if (loggedUpdate) {
                console.log(`[Codeforces] Synced NEW data for ${user.codeforces_username}`);
            }
        }

        if ((cfDoc.lastSolvedDay || 0) < yesterdayTime) {
            cfDoc.streak = 0;
        }

        cfDoc.lastSyncedAt = new Date();
        await cfDoc.save();

    } catch (error) {
        console.error(`Error syncing CF for ${user.codeforces_username}:`, error);
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
            const chronologicalSubs = [...submissions].reverse();
            let loggedUpdate = false;

            for (const sub of chronologicalSubs) {
              
                if (sub.verdict === "OK") {
                    lcDoc.totalSolved += 1;
                    
                    const subDate = new Date(sub.timestamp * 1000);
                    subDate.setHours(0, 0, 0, 0);
                    const subDay = subDate.getTime();
                    
                    if (subDay === todayTime) {
                        lcDoc.todaySolved += 1;
                    }

                    if (lastDay === 0) {
                        lcDoc.streak = 1;
                    } else if (subDay === lastDay + ONE_DAY) {
                        lcDoc.streak += 1;
                    } else if (subDay > lastDay + ONE_DAY) {
                        lcDoc.streak = 1;
                    }
                    
                    lastDay = subDay;
                    loggedUpdate = true;
                }
            }

            lcDoc.lastSubmissionID = String(submissions[0].submissionID);
            lcDoc.lastSubmissionTime = new Date(submissions[0].timestamp * 1000);
            
            if (loggedUpdate) {
                console.log(`[LeetCode] Synced NEW data for ${user.leetcode_username}`);
            }
        }

        if (lastDay < yesterdayTime) {
            lcDoc.streak = 0;
        }

        lcDoc.lastSyncedAt = new Date();
        await lcDoc.save();

    } catch (error) {
        console.error(`Error syncing LC for ${user.leetcode_username}:`, error);
    }
};

export const startPoller = () => {
    console.log("Starting the platform stats poller...");
    
    const runSync = async () => {
        
        console.log(`[${new Date().toISOString()}] Running sync...`); 
        
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


        cron.schedule("49 59 23 * * *", async () => {
                    console.log(`[${new Date().toISOString()}] Midnight approaches. Generating archive...`);
                    await createDailyArchive();
                });
    runSync();
    cron.schedule("0 * * * *", runSync);
};