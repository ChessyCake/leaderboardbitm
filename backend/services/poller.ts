import User from "../models/users.model";
import Codeforces from "../models/cfstats.model";
import { fetchUserInfo } from "./codeforces/fetch";

const sleep = (ms: number) =>
    new Promise(resolve => setTimeout(resolve, ms));

const USER_DELAY = 1000;         
const POLL_INTERVAL = 60 * 60 * 1000; 

const cfPoller = async () => {

    console.log("\n Codeforces Poller Started");

    try {

        const start = Date.now();

        const users = await User.find({
            codeforces_username: {
                $ne: ""
            }
        });

        console.log(` Found ${users.length} users`);

        for (let i = 0; i < users.length; i++) {

            const user = users[i];

            console.log(
                `\n[${i + 1}/${users.length}] Syncing ${user.codeforces_username}`
            );

            try {

                let cf = await Codeforces.findOne({
                    user: user._id
                });

                // First time sync
                if (!cf) {

                    cf = await Codeforces.create({

                        user: user._id,

                        rating: 0,
                        maxRating: 0,

                        rank: "",
                        maxRank: "",

                        totalSolved: 0,
                        todaySolved: 0,

                        streak: 0,

                        lastSolvedDay: null,
                        lastSubmissionId: 0,

                        lastSyncedAt: null

                    });

                    console.log("Created new CF document");
                }

                const updated = await fetchUserInfo(

                    user.codeforces_username,

                    cf.lastSubmissionId,

                    cf.lastSolvedDay ?? null,

                    cf.streak,

                    cf.totalSolved

                );

                if (!updated) {

                    console.log("Skipped");

                    await sleep(USER_DELAY);

                    continue;

                }

                cf.totalSolved = updated.totalSolved;
                cf.todaySolved = updated.todaySolved;

                cf.streak = updated.streak;

                cf.lastSolvedDay = updated.lastSolvedDay;
                cf.lastSubmissionId = updated.lastSubmissionId;

               

                cf.lastSyncedAt = new Date();

                await cf.save();

                console.log(
                    ` ${user.codeforces_username}`
                );

                console.log(
                    `Solved: ${cf.totalSolved} | Today: ${cf.todaySolved} | Streak: ${cf.streak}`
                );

            }
            catch (err) {

                console.error(
                    ` Failed ${user.codeforces_username}`
                );

                console.error(err);

            }

            await sleep(USER_DELAY);

        }

        const seconds = ((Date.now() - start) / 1000).toFixed(2);

        console.log(
            `\n Poll Finished in ${seconds}s`
        );

    }
    catch (err) {

        console.error("Poller Error:", err);

    }

};

export const startPoller = async () => {

    while (true) {

        try {

            await cfPoller();

        }
        catch (err) {

            console.error("Poller crashed:", err);

        }

        console.log(
            `\n Sleeping for ${POLL_INTERVAL / 1000}s...\n`
        );

        await sleep(POLL_INTERVAL);

    }

};