export interface LeaderboardUser {
  rank: number;
  name: string;
  avatar: string;
  codeforcesUsername: string;
  streak: number;
  todaySolved: number;
  totalSolved: number;
  cfRating?: number;
  lcRating?: number;
  tier?: string;
  role?: string;
  id?: number;
}

export interface StatsOverview {
  studentsOnline: number;
  solvedToday: number;
  activeStreaks: number;
  totalRegistered: number;
}
