import { Request, Response } from "express";
import Codeforces from "../models/cfstats.model";
import User from "../models/users.model";

export const getLeaderboard = async (
    req: Request,
    res: Response
) => {
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

        const data = leaderboard.map((cf, index) => ({

            rank: skip + index + 1,

            name: (cf.user as any)?.name || "Unknown",

            avatar: (cf.user as any)?.avatar || "",

            codeforcesUsername:
                (cf.user as any)?.codeforces_username || "",

            leetcodeUsername:
                (cf.user as any)?.leetcode_username || "",

            streak: cf.streak,

            todaySolved: cf.todaySolved,

            totalSolved: cf.totalSolved,

            cfRating: cf.rating,

            cfMaxRating: cf.maxRating,

            cfRank: cf.rank,

        }));

        /* ── Aggregate stats for the dashboard cards ── */
        const [statsAgg] = await Codeforces.aggregate([
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

        const studentsOnline = await User.countDocuments({
            codeforces_username: { $ne: "" },
        });

        return res.status(200).json({

            success: true,

            page,

            totalPages: Math.ceil(totalUsers / limit),

            totalUsers,

            leaderboard: data,

            stats: {
                studentsOnline,
                solvedToday: statsAgg?.solvedToday ?? 0,
                activeStreaks: statsAgg?.activeStreaks ?? 0,
                totalRegistered: totalUsers,
            },

        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({

            success: false,

            message: "Internal Server Error"

        });

    }
};