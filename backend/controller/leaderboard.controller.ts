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
      { 
        $group: {
          _id: null,
          totalActive: { $sum: 1 },
          cfSolvedToday: { $sum: "$cf.todaySolved" },
          lcSolvedToday: { $sum: "$lc.todaySolved" }
        }
      }
    ]);

    const activeUsersCount = activeCountResult?.totalActive || 0;
    const cfSolvedToday = activeCountResult?.cfSolvedToday || 0;
    const lcSolvedToday = activeCountResult?.lcSolvedToday || 0;

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

    const stats = {
        activeToday: activeUsersCount,
        solvedToday: cfSolvedToday + lcSolvedToday,
        cfSolvedToday: cfSolvedToday,
        lcSolvedToday: lcSolvedToday,
    };

    return res.json({
      success: true,
      page,
      totalPages: Math.ceil(activeUsersCount / limit),
      totalUsers: totalUsers,
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