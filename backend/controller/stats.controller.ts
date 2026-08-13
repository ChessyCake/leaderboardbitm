import { Request, Response } from "express";
import Codeforces from "../models/cfstats.model";
import LeetCode from "../models/lcstats.model";
import User from "../models/users.model";

export const getOverallStats = async (req: Request, res: Response) => {
    try {
        const [activeCountResult] = await User.aggregate([
            {
                $lookup: {
                    from: Codeforces.collection.name,
                    localField: "_id",
                    foreignField: "user",
                    as: "cf",
                },
            },
            { $unwind: { path: "$cf", preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: LeetCode.collection.name,
                    localField: "_id",
                    foreignField: "user",
                    as: "lc",
                },
            },
            { $unwind: { path: "$lc", preserveNullAndEmptyArrays: true } },
            {
                $addFields: {
                    todaySolved: {
                        $add: [
                            { $ifNull: ["$cf.todaySolved", 0] },
                            { $ifNull: ["$lc.todaySolved", 0] },
                        ],
                    },
                    activeCFStreak: { $cond: [{ $gt: ["$cf.streak", 0] }, 1, 0] },
                    activeLCStreak: { $cond: [{ $gt: ["$lc.streak", 0] }, 1, 0] }
                },
            },
            { $match: { todaySolved: { $gt: 0 } } },
            { 
                $group: {
                    _id: null,
                    totalActive: { $sum: 1 },
                    cfSolvedToday: { $sum: "$cf.todaySolved" },
                    lcSolvedToday: { $sum: "$lc.todaySolved" },
                    totalCFStreaks: { $sum: "$activeCFStreak" },
                    totalLCStreaks: { $sum: "$activeLCStreak" }
                }
            }
        ]);

        const activeUsersCount = activeCountResult?.totalActive || 0;
        const cfSolvedToday = activeCountResult?.cfSolvedToday || 0;
        const lcSolvedToday = activeCountResult?.lcSolvedToday || 0;
        const totalActiveStreaks = (activeCountResult?.totalCFStreaks || 0) + (activeCountResult?.totalLCStreaks || 0);

        const studentsOnline = await User.countDocuments({
            $or: [
                { codeforces_username: { $ne: "" } },
                { leetcode_username: { $ne: "" } }
            ]
        });

        return res.status(200).json({
            success: true,
            message: "Global stats fetched successfully",
            stats: {
                studentsOnline,
                activeToday: activeUsersCount,
                totalCFSolvedToday: cfSolvedToday,
                totalLCSolvedToday: lcSolvedToday,
                totalActiveStreaks: totalActiveStreaks,
            }
        });

    } catch (err) {
        console.error("Error fetching global stats:", err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};