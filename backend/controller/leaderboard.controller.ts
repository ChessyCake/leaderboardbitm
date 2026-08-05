import { Request, Response } from "express";
import Codeforces from "../models/cfstats.model";
import User from "../models/users.model"; 
import LeetCode from "../models/lcstats.model";

export const getLeaderboard = async (req: Request, res: Response) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = 25;
        const skip = (page - 1) * limit;

        const totalUsers = await Codeforces.countDocuments();

        const leaderboard = await Codeforces.find()
            .sort({
                todaySolved: -1,
                streak: -1,
                totalSolved: -1
            })
            .skip(skip)
            .limit(limit)
            .populate(
                "user",
                "name avatar codeforces_username leetcode_username"
            );

        const data = await Promise.all(
            leaderboard.map(async (cf, index) => {
                const userId = (cf.user as any)?._id;
                let lcStats = null;
                if (userId) {
                    lcStats = await LeetCode.findOne({ user: userId });
                }

                return {
                    rank: skip + index + 1,
                    name: (cf.user as any)?.name || "Unknown",
                    avatar: (cf.user as any)?.avatar || "https://api.dicebear.com/10.x/lorelei/svg",
                    codeforcesUsername: (cf.user as any)?.codeforces_username || "",
                    leetcodeUsername: (cf.user as any)?.leetcode_username || "",
                    streak: cf.streak,
                    todaySolved: cf.todaySolved + (lcStats?.todaySolved || 0),
                    totalSolved: cf.totalSolved + (lcStats?.totalSolved || 0),
                    cfSolvedToday: cf.todaySolved,
                    cfSolved: cf.totalSolved,
                    cfStreak: cf.streak,
                    lcSolvedToday: lcStats?.todaySolved || 0,
                    lcSolved: lcStats?.totalSolved || 0,
                    lcStreak: lcStats?.streak || 0,
                };
            })
        );

    
        const [cfStats] = await Codeforces.aggregate([
            {
                $group: {
                    _id: null,
                    solvedToday: { $sum: "$todaySolved" },
                    totalSolved: { $sum: "$totalSolved" },
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
                    totalSolved: { $sum: "$totalSolved" },
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

        const stats = {
            activeToday: activeUsersSet.size,
            solvedToday: (cfStats?.solvedToday || 0) + (lcStats?.solvedToday || 0),
            cfSolvedToday: cfStats?.solvedToday || 0,
            lcSolvedToday: lcStats?.solvedToday || 0,
        };

        return res.status(200).json({
            success: true,
            page,
            totalPages: Math.ceil(totalUsers / limit),
            totalUsers,
            leaderboard: data,
            stats,
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};