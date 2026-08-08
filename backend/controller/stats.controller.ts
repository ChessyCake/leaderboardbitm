import { Request, Response } from "express";
import Codeforces from "../models/cfstats.model";
import LeetCode from "../models/lcstats.model";
import User from "../models/users.model";

export const getOverallStats = async (req: Request, res: Response) => {
    try {
        const [cfStats] = await Codeforces.aggregate([
            {
                $group: {
                    _id: null,
                    solvedToday: { $sum: "$todaySolved" },
                    activeStreaks: {
                        $sum: { $cond: [{ $gt: ["$streak", 0] }, 1, 0] },
                    },
                },
            },
        ]);

        const [lcStats] = await LeetCode.aggregate([
            {
                $group: {
                    _id: null,
                    solvedToday: { $sum: "$todaySolved" },
                    activeStreaks: {
                        $sum: { $cond: [{ $gt: ["$streak", 0] }, 1, 0] },
                    },
                },
            },
        ]);

        const activeCFUsers = await Codeforces.find({ todaySolved: { $gt: 0 } }).distinct("user");
        const activeLCUsers = await LeetCode.find({ todaySolved: { $gt: 0 } }).distinct("user");
        const activeUsersSet = new Set([
            ...activeCFUsers.map(id => id.toString()),
            ...activeLCUsers.map(id => id.toString())
        ]);

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
                activeToday: activeUsersSet.size,
                totalCFSolvedToday: cfStats?.solvedToday || 0,
                totalLCSolvedToday: lcStats?.solvedToday || 0,
                totalActiveStreaks: (cfStats?.activeStreaks || 0) + (lcStats?.activeStreaks || 0),
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