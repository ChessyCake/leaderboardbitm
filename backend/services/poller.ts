import cron from "node-cron";

import User from "../models/users.model"; 
import Codeforces from "../models/cfstats.model"; 
import LeetCode from "../models/lcstats.model";

import { createDailyArchive } from "../controller/archive.controller";

import { getSub as getCFSub } from "./codeforces/fetch";
import { getSub as getLCSub } from "./leetcode/fetch";

const ONE_DAY = 24 * 60 * 60 * 1000;

/** Returns "YYYY-MM-DD" in local time — used for robust day comparison */
const localDateStr = (date: Date = new Date()): string => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
};

const syncCodeforces = async (user: any) => {
    try {
        if (!user.codeforces_username) return;

        let cfDoc = await Codeforces.findOne({ user: user._id });
        if (!cfDoc) cfDoc = new Codeforces({ user: user._id });

        
        const submissions = await getCFSub({
            username: user.codeforces_username,
            lastSolvedID: null, 
        });

        if (submissions.length === 0) {
            cfDoc.lastSyncedAt = new Date();
            await cfDoc.save();
            return;
        }

        const todayStr = localDateStr();
        const todayMidnight = new Date(); todayMidnight.setHours(0, 0, 0, 0);
        const todayTime = todayMidnight.getTime();
        const yesterdayTime = todayTime - ONE_DAY;

        const lastKnownId = cfDoc.lastSubmissionId || 0;

        
        const chronologicalSubs = [...submissions].reverse();

        let maxSeenId = lastKnownId;
        let todaySolvedCount = 0; 

        for (const sub of chronologicalSubs) {
            if (sub.verdict === "TESTING" || sub.verdict === "WAITING") continue;

            const isNew = Number(sub.submissionID) > lastKnownId;

            if (sub.verdict === "OK") {
                const subDate = new Date(sub.timestamp * 1000);
                const subDayStr = localDateStr(subDate);

            
                if (subDayStr === todayStr) {
                    todaySolvedCount += 1;
                }
                if (isNew) {
                    cfDoc.totalSolved += 1;

                    subDate.setHours(0, 0, 0, 0);
                    const subDay = subDate.getTime();
                    const currentLastDay = cfDoc.lastSolvedDay || 0;

                    if (currentLastDay === 0) {
                        cfDoc.streak = 1;
                    } else {
                        const diffDays = Math.round((subDay - currentLastDay) / ONE_DAY);
                        if (diffDays === 1) {
                            cfDoc.streak += 1;
                        } else if (diffDays > 1) {
                            cfDoc.streak = 1;
                        }
                    }

                    cfDoc.lastSolvedDay = subDay;
                }
            }

            if (Number(sub.submissionID) > maxSeenId) {
                maxSeenId = Number(sub.submissionID);
            }
        }

        cfDoc.todaySolved = todaySolvedCount;
        cfDoc.lastSubmissionId = maxSeenId;

        const currentCFLastDay = cfDoc.lastSolvedDay || 0;
        if (currentCFLastDay > 0) {
            const diffDays = Math.round((todayTime - currentCFLastDay) / ONE_DAY);
            if (diffDays > 1) {
                cfDoc.streak = 0;
            }
        }

        console.log(`[CF] ${user.codeforces_username} | todaySolved=${cfDoc.todaySolved} | streak=${cfDoc.streak}`);

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

        const todayStr = localDateStr();
        const todayMidnight = new Date(); todayMidnight.setHours(0, 0, 0, 0);
        const todayTime = todayMidnight.getTime();
        const yesterdayTime = todayTime - ONE_DAY;

        const lastSolvedDayStr = lcDoc.lastSolvedDay
            ? localDateStr(new Date(lcDoc.lastSolvedDay))
            : null;

        if (lastSolvedDayStr !== todayStr) {
            lcDoc.todaySolved = 0;
        }

        if (submissions.length > 0) {
            const chronologicalSubs = [...submissions].reverse();

            for (const sub of chronologicalSubs) {
                if (sub.verdict === "OK") {
                    lcDoc.totalSolved += 1;

                    const subDate = new Date(sub.timestamp * 1000);
                    const subDayStr = localDateStr(subDate);

                    if (subDayStr === todayStr) {
                        lcDoc.todaySolved += 1;
                    }


                    subDate.setHours(0, 0, 0, 0);
                    const subDay = subDate.getTime();
                    const currentLastDay = (lcDoc as any).lastSolvedDay || 0;

                    if (currentLastDay === 0) {
                        lcDoc.streak = 1;
                    } else {
                        const diffDays = Math.round((subDay - currentLastDay) / ONE_DAY);
                        if (diffDays === 1) {
                            lcDoc.streak += 1;
                        } else if (diffDays > 1) {
                            lcDoc.streak = 1;
                        }
                    }

                    (lcDoc as any).lastSolvedDay = subDay;
                }
            }

            if (submissions[0]) {
                lcDoc.lastSubmissionID = String(submissions[0].submissionID);
                lcDoc.lastSubmissionTime = new Date(submissions[0].timestamp * 1000);
            }
            console.log(`[LC] ${user.leetcode_username} | todaySolved=${lcDoc.todaySolved} | streak=${lcDoc.streak}`);
        }

        const lcLastSolvedDay = (lcDoc as any).lastSolvedDay || 0;
        if (lcLastSolvedDay > 0) {
            const diffDays = Math.round((todayTime - lcLastSolvedDay) / ONE_DAY);
            if (diffDays > 1) {
                lcDoc.streak = 0;
            }
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
                }, {
                    timezone: "Asia/Kolkata"
                });
    runSync();
    cron.schedule("* * * * *", runSync);
};