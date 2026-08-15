import { EMOJI } from "../config/emojis";

type LeaderboardUser = {
  name?: string;
  avatar?: string;
  codeforcesUsername?: string;
  leetcodeUsername?: string;
  todaySolved?: number;
  cfSolvedToday?: number;
  lcSolvedToday?: number;
  streak?: number;
};

type LeaderboardStats = {
  activeToday?: number;
  solvedToday?: number;
  cfSolvedToday?: number;
  lcSolvedToday?: number;
};

type BuildLeaderboardEmbedDescriptionArgs = {
  title: string;
  subtitle: string;
  emptyMessage: string;
  users: LeaderboardUser[];
  stats: LeaderboardStats;
  requestedBy?: string | null;
};

const formatProfileLink = (label: string, username: string, baseUrl: string) => {
  const safeUsername = username.trim();

  if (!safeUsername) {
    return null;
  }

  return `${label}: [${safeUsername}](${baseUrl}${encodeURIComponent(safeUsername)})`;
};

const formatRankBadge = (index: number) => {
  if (index === 0) return EMOJI.crown;
  if (index === 1) return EMOJI.silver;
  if (index === 2) return EMOJI.bronze;

  return `\`${String(index + 1).padStart(2, "0")}\``;
};

export const buildLeaderboardEmbedDescription = ({
  title,
  subtitle,
  emptyMessage,
  users,
  stats,
  requestedBy,
}: BuildLeaderboardEmbedDescriptionArgs) => {
  let description = `${title}\n${subtitle}\n\n`;

  if (users.length === 0) {
    description += `**${EMOJI.sparkle} STANDINGS**\n${emptyMessage}\n\n`;
  } else {
    description += `**${EMOJI.crown} TOP OPERATORS**\n`;

    users.forEach((user, index) => {
      const displayName = (user.name || user.codeforcesUsername || user.leetcodeUsername || "UNKNOWN").toUpperCase();
      const rankBadge = formatRankBadge(index);
      const solvedToday = user.todaySolved ?? 0;
      const cfSolvedToday = user.cfSolvedToday ?? 0;
      const lcSolvedToday = user.lcSolvedToday ?? 0;
      const streak = user.streak ?? 0;

      const profileLinks = [
        user.codeforcesUsername
          ? formatProfileLink("CF", user.codeforcesUsername, "https://codeforces.com/profile/")
          : null,
        user.leetcodeUsername
          ? formatProfileLink("LC", user.leetcodeUsername, "https://leetcode.com/u/")
          : null,
      ].filter(Boolean) as string[];

      description += `> ${rankBadge} **${displayName}**\n`;
      description += `> └ ${profileLinks.length > 0 ? profileLinks.join(" | ") : "─"}\n`;
      description += `> └ Solved: **${solvedToday}** | ${EMOJI.cf} **${cfSolvedToday}** | ${EMOJI.lc} **${lcSolvedToday}**`;

      if (streak > 0) {
        description += ` | ${EMOJI.fire} **${streak}**`;
      }

      description += `\n`;
    });

    description += `\n`;
  }

  description += `**${EMOJI.stats} TODAY'S STATS**\n`;
  description += `> Active Operators: **${stats.activeToday ?? 0}**\n`;
  description += `> Total Solved: **${stats.solvedToday ?? 0}**\n`;
  description += `> ${EMOJI.cf} CF: **${stats.cfSolvedToday ?? 0}** | ${EMOJI.lc} LC: **${stats.lcSolvedToday ?? 0}**`;

  if (requestedBy) {
    description += `\n> Requested by: **${requestedBy}**`;
  }

  const thumbnailUrl = users.find((user) => Boolean(user.avatar))?.avatar ?? null;

  return {
    description,
    thumbnailUrl,
  };
};