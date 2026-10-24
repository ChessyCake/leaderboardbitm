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

/**
 * Weekly aggregate stats for the archive page.
 */
export interface WeeklyStats {
  totalCfSolved: number;
  totalLcSolved: number;
  onlineUsers: number;
  daysArchived: number;
}

/**
 * Full API response shape from GET /api/archive?date=YYYY-MM-DD&page=N
 */
export interface ArchiveApiResponse {
  success: boolean;
  date: string;
  page: number;
  totalPages: number;
  totalUsers: number;
  leaderboard: LeaderboardUser[];
  stats: StatsOverview;
}

/**
 * Codeforces Contest Information
 */
export interface CfContestInfo {
  id: number;
  name: string;
  type: string;
  phase: string;
  frozen: boolean;
  durationSeconds: number;
  startTimeSeconds?: number;
  relativeTimeSeconds?: number;
}

/**
 * Problem metadata in Codeforces contest
 */
export interface CfContestProblem {
  contestId?: number;
  index: string;
  name: string;
  type?: string;
  points?: number;
  rating?: number;
  tags?: string[];
}

/**
 * Problem result for a participant
 */
export interface CfProblemResult {
  points: number;
  penalty?: number;
  rejectedAttemptCount?: number;
  type?: string;
  bestSubmissionTimeSeconds?: number;
}

/**
 * User entry in the Codeforces contest standings
 */
export interface CfContestUser {
  rank: number;
  localRank?: number;
  name: string;
  username: string;
  avatar?: string;
  points: number;
  penalty?: number;
  problemsSolved?: number;
  problemResults?: CfProblemResult[];
}

/**
 * Full API response shape from GET /cfcontest
 */
export interface CfContestApiResponse {
  message?: boolean;
  success?: boolean;
  contest?: CfContestInfo | null;
  problems?: CfContestProblem[];
  totalParticipants?: number;
  darn?: CfContestUser[];
  leaderboard?: CfContestUser[];
  data?: CfContestUser[];
  error?: string;
}

