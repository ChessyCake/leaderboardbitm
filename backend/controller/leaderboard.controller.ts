import { Request, Response } from "express";
import Codeforces from "../models/cfstats.model";
import User from "../models/users.model"; 
import LeetCode from "../models/lcstats.model";

export const getLeaderboard = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = 25;
    const skip = (page - 1) * limit;

    const totalUsers = await User.countDocuments();

    const users = await User.aggregate([
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
          totalSolved: {
            $add: [
              { $ifNull: ["$cf.totalSolved", 0] },
              { $ifNull: ["$lc.totalSolved", 0] },
            ],
          },
          streak: {
            $max: [
              { $ifNull: ["$cf.streak", 0] },
              { $ifNull: ["$lc.streak", 0] },
            ],
          },
        },
      },

      {
        $match: {
          todaySolved: { $gt: 0 },
        },
      },

      {
        $sort: {
          todaySolved: -1,
          streak: -1,
          totalSolved: -1,
        },
      },

      { $skip: skip },
      { $limit: limit },
    ]);

    // Count active users separately for accurate pagination
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
        },
      },
      { $match: { todaySolved: { $gt: 0 } } },
      { $count: "total" },
    ]);

    const activeUsersCount = activeCountResult?.total || 0;

    const leaderboard = users.map((u, index) => ({
      rank: skip + index + 1,
      name: u.name,
      avatar: u.avatar,
      codeforcesUsername: u.codeforces_username || undefined,
      leetcodeUsername: u.leetcode_username || undefined,

      todaySolved: u.todaySolved,
      totalSolved: u.totalSolved,
      streak: u.streak,
      
      cfSolvedToday: u.cf?.todaySolved || 0,
      cfSolved: u.cf?.totalSolved || 0,
      cfStreak: u.cf?.streak || 0,
      
      lcSolvedToday: u.lc?.todaySolved || 0,
      lcSolved: u.lc?.totalSolved || 0,
      lcStreak: u.lc?.streak || 0,
    }));

    const [cfStats] = await Codeforces.aggregate([
        { $group: { _id: null, solvedToday: { $sum: "$todaySolved" } } }
    ]);
    const [lcStats] = await LeetCode.aggregate([
        { $group: { _id: null, solvedToday: { $sum: "$todaySolved" } } }
    ]);

    const stats = {
        activeToday: activeUsersCount,
        solvedToday: (cfStats?.solvedToday || 0) + (lcStats?.solvedToday || 0),
        cfSolvedToday: cfStats?.solvedToday || 0,
        lcSolvedToday: lcStats?.solvedToday || 0,
    };

    return res.json({
      success: true,
      page,
      totalPages: Math.ceil(activeUsersCount / limit),
      totalUsers: activeUsersCount,
      leaderboard,
      stats,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};