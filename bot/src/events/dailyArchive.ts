import { TextChannel, EmbedBuilder, AttachmentBuilder } from "discord.js";
import { api } from "../services/api";
import path from "path";
import { fileURLToPath } from "url";

// ── Resolve asset path ──
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const BANNER_PATH = path.join(__dirname, "..", "assets", "archive_banner.png");

// ── Theme ──
const ARCHIVE_PURPLE = 0x8b5cf6;

export const postDailyArchive = async (
  channel: TextChannel
) => {
  try {
    const { data } = await api.get(
      "/internal/bot/latest-archive"
    );

    console.log(data);

    if (!data?.success || !data?.archive) {
      console.log("No archive found yet");
      return;
    }

    const archive = data.archive;

    const topUsers = Array.isArray(archive.top_users)
      ? archive.top_users
      : [];

    // ── Attach banner image ──
    const bannerAttachment = new AttachmentBuilder(BANNER_PATH, {
      name: "archive_banner.png",
    });

    // ── Build leaderboard with medals & bars ──
    let leaderboard = "";

    if (topUsers.length === 0) {
      leaderboard = "> *No operators were active today.*\n";
    } else {
      topUsers.forEach((u: any, i: number) => {
        const medal =
          i === 0 ? "👑" : i === 1 ? "🥈" : i === 2 ? "🥉" : `\`${String(i + 1).padStart(2, "0")}\``;
        const solved = u.totalSolvedToday ?? u.todaySolved ?? 0;
        const solvedBar = "▰".repeat(Math.min(solved || 1, 10)) + "▱".repeat(Math.max(10 - (solved || 1), 0));
        const nameUpper = (u.name || "UNKNOWN").toUpperCase();

        // Show CF/LC breakdown if available
        const cfVal = u.cfSolvedToday ?? 0;
        const lcVal = u.lcSolvedToday ?? 0;
        const cfTag = cfVal > 0 ? `🟠 CF:\`${cfVal}\`` : "";
        const lcTag = lcVal > 0 ? `🟡 LC:\`${lcVal}\`` : "";
        const platforms = [cfTag, lcTag].filter(Boolean).join("  ");
        const platformStr = platforms ? ` ─ ${platforms}` : "";

        if (i < 3) {
          leaderboard += `> ${medal}  **${nameUpper}**\n`;
          leaderboard += `> \`${solvedBar}\` **${solved}** solved${platformStr}\n\n`;
        } else {
          leaderboard += `> ${medal}  **${nameUpper}** ── **${solved}** solved${platformStr}\n`;
        }
      });
    }

    // ── Format the date nicely ──
    const archiveDate = new Date(archive.date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // ── Progress bar helper ──
    const bar = (val: number, max: number) => {
      const filled = Math.min(10, Math.max(0, Math.round((val / Math.max(max, 1)) * 10)));
      return "▰".repeat(filled) + "▱".repeat(10 - filled);
    };

    const totalSolved = archive.total_solved ?? 0;
    const cfSolved = archive.total_CFsolved ?? 0;
    const lcSolved = archive.total_LCsolved ?? 0;

    // ── Build description ──
    let desc = "";

    desc += `### 🏆 ── TOP OPERATORS\n\n`;
    desc += leaderboard;
    desc += `\n### 📊 ── DAY SUMMARY\n\n`;

    desc += `> 👥 **Active Operators** ── **\`${archive.total_online ?? 0}\`**\n\n`;

    desc += `> ⚡ **Total Solved** ────── **\`${totalSolved}\`**\n`;
    desc += `> \`${bar(totalSolved, totalSolved || 1)}\`\n\n`;

    desc += `> 🟠 **Codeforces** ─────── **\`${cfSolved}\`** solved\n`;
    desc += `> \`${bar(cfSolved, totalSolved || 1)}\`\n\n`;

    desc += `> 🟡 **LeetCode** ──────── **\`${lcSolved}\`** solved\n`;
    desc += `> \`${bar(lcSolved, totalSolved || 1)}\`\n\n`;

    desc += `-# This snapshot was automatically captured at end of day`;

    const embed = new EmbedBuilder()
      .setColor(ARCHIVE_PURPLE)
      .setAuthor({
        name: "COMP_LEAGUE ⚡ DAILY ARCHIVE",
        iconURL: "https://cdn.discordapp.com/emojis/1145727546653970432.gif",
      })
      .setTitle("⟨🏆⟩ ── ARCHIVE SNAPSHOT ── ⟨🏆⟩")
      .setDescription(desc)
      .setImage("attachment://archive_banner.png")
      .setFooter({
        text: "COMP_LEAGUE • DAILY SNAPSHOT • ARCHIVED",
        iconURL: "https://cdn.discordapp.com/emojis/1145727546653970432.gif",
      })
      .setTimestamp(new Date(archive.date));

    await channel.send({
      embeds: [embed],
      files: [bannerAttachment],
    });

    console.log("Archive posted successfully");
  } catch (err) {
    console.error("Failed to post archive:", err);
  }
};