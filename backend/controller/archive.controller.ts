import { Request, Response } from "express";
import Archive from "../models/archive.model";
import Codeforces from "../models/cfstats.model";
import LeetCode from "../models/lcstats.model";


export const getArchive = async (req: Request, res: Response) => {
    try {
        const data = await Archive.find().sort({ date: -1 }).limit(7);

        return res.status(200).json({
            success: true,
            data,
        });
    } catch (err) {
        console.error("Error fetching archive:", err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

export const createDailyArchive = async () => {
    console.log("Generating daily archive...");
    
    try {

        const activeCF = await Codeforces.find({ todaySolved: { $gt: 0 } }).populate("user", "name");
        const activeLC = await LeetCode.find({ todaySolved: { $gt: 0 } }).populate("user", "name");

        let total_CFsolved = 0;
        let total_LCsolved = 0;


        const userMap = new Map();

        for (const cf of activeCF) {
            if (!cf.user) continue; 
            total_CFsolved += cf.todaySolved;

            const userId = (cf.user as any)._id.toString();
            
            userMap.set(userId, {
                name: (cf.user as any).name,
                cfSolved: cf.todaySolved,
                lcSolved: 0,
                totalSolvedToday: cf.todaySolved,
            });
        }

        for (const lc of activeLC) {
            if (!lc.user) continue; 
            total_LCsolved += lc.todaySolved;

            const userId = (lc.user as any)._id.toString();
            
            if (userMap.has(userId)) {
                const userData = userMap.get(userId);
                userData.lcSolved = lc.todaySolved;
                userData.totalSolvedToday += lc.todaySolved;
            } else {
                userMap.set(userId, {
                    name: (lc.user as any).name,
                    cfSolved: 0,
                    lcSolved: lc.todaySolved,
                    totalSolvedToday: lc.todaySolved,
                });
            }
        }

        const top_users = Array.from(userMap.values())
            .sort((a, b) => b.totalSolvedToday - a.totalSolvedToday)
            .slice(0, 5);

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const archiveData = {
            date: today.getTime(),
            top_users,
            total_online: userMap.size,
            total_solved: total_CFsolved + total_LCsolved,
            total_LCsolved,
            total_CFsolved,
        };

        await Archive.updateOne(
            { date: today.getTime() },
            { $set: archiveData },
            { upsert: true }
        );

        console.log("Daily archive successfully created!");

    } catch (err) {
        console.error("Failed to generate daily archive:", err);
    }
};