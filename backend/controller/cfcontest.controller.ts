import { Request, Response } from "express";
import User from "../models/users.model";
import { getPreviousContest } from "../services/codeforces/fetch";

interface CachedContest {
  contestId: number;
  timestamp: number;
  payload: any;
}

let cache: CachedContest | null = null;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes cache

export const lastLeaderBoard = async (req: Request, res: Response) => {
  try {
    const requestedId = req.query.contestId
      ? Number(req.query.contestId)
      : null;

    let targetContestId = requestedId;
    if (!targetContestId || isNaN(targetContestId)) {
      targetContestId = await getPreviousContest();
    }

    const now = Date.now();
    if (
      cache &&
      cache.contestId === targetContestId &&
      now - cache.timestamp < CACHE_TTL_MS
    ) {
      return res.status(200).json(cache.payload);
    }

    const response = await fetch(
      `https://codeforces.com/api/contest.standings?contestId=${targetContestId}`
    );

    const data = await response.json();

    if (data.status !== "OK") {
      throw new Error(data.comment || "Failed to fetch Codeforces contest standings");
    }

    const rankings = data.result.rows || [];
    const contestInfo = data.result.contest;
    const problems = data.result.problems || [];

    const allUsers = await User.find({
      codeforces_username: { $exists: true, $ne: "" },
    }).lean();

    const userMap = new Map<string, (typeof allUsers)[0]>();
    for (const u of allUsers) {
      if (u.codeforces_username) {
        userMap.set(u.codeforces_username.trim().toLowerCase(), u);
      }
    }

    const collegeRanks: any[] = [];

    for (const row of rankings) {
      const handle = row.party?.members?.[0]?.handle;
      if (!handle) continue;

      const user = userMap.get(handle.toLowerCase());
      if (user) {
        const problemsSolved = Array.isArray(row.problemResults)
          ? row.problemResults.filter((p: any) => p && p.points > 0).length
          : 0;

        collegeRanks.push({
          name: user.name,
          username: handle,
          avatar: user.avatar || "",
          rank: row.rank,
          points: row.points,
          penalty: row.penalty ?? 0,
          problemsSolved,
          problemResults: row.problemResults ?? [],
        });
      }
    }

    // Sort by global rank ascending (best rank first)
    collegeRanks.sort((a, b) => a.rank - b.rank);

    collegeRanks.forEach((item, index) => {
      item.localRank = index + 1;
    });

    const payload = {
      success: true,
      contest: contestInfo,
      problems: problems,
      totalParticipants: rankings.length,
      leaderboard: collegeRanks,
      data: collegeRanks,
    };

    cache = {
      contestId: targetContestId,
      timestamp: now,
      payload,
    };

    return res.status(200).json(payload);
  } catch (error: any) {
    console.error("[CF Contest Controller] Error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to load contest standings",
    });
  }
};



