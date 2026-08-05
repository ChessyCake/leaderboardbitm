/**
 * Matches the shape returned by GET /api/leaderboard
 * from the backend controller.
 */
export interface LeaderboardUser {
  rank: number;
  name: string;
  avatar: string;
  codeforcesUsername: string;
  leetcodeUsername?: string;
  streak: number;
  todaySolved: number;
  totalSolved: number;
  cfSolvedToday: number;
  cfSolved: number;
  cfStreak: number;
  lcSolvedToday: number;
  lcSolved: number;
  lcStreak: number;
  /** Codeforces current rating (from CF model `rating`) */
  cfRating?: number;
  /** Codeforces max rating */
  cfMaxRating?: number;
  /** Codeforces rank string, e.g. "expert" */
  cfRank?: string;
  /** Derived on frontend based on position */
  tier?: string;
  role?: string;
  id?: number;
}

/**
 * Aggregate stats returned in the `stats` field of
 * the leaderboard API response.
 */
export interface StatsOverview {
  activeToday: number;
  solvedToday: number;
  cfSolvedToday: number;
  lcSolvedToday: number;
}

/**
 * Full API response shape from GET /api/leaderboard?page=N
 */
export interface LeaderboardApiResponse {
  success: boolean;
  page: number;
  totalPages: number;
  totalUsers: number;
  leaderboard: LeaderboardUser[];
  stats: StatsOverview;
}
