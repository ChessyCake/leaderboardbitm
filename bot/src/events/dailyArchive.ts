import { TextChannel, EmbedBuilder, AttachmentBuilder } from "discord.js";
import { api } from "../services/api";
import { EMOJI } from "../config/emojis";
import path from "path";
import { fileURLToPath } from "url";

// ── Resolve asset path ──
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const BANNER_PATH = path.join(__dirname, "..", "assets", "archive_banner.png");

// ── Theme ──
const THEME_RED = 0xff0000;
const GLITCH_GIF = "https://media.giphy.com/media/xT9IgzoKnwFNmISR8I/giphy.gif";

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

    // Banner removed in favor of Glitch GIF

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

    let description = `**${EMOJI.bullet} ARCHIVE SNAPSHOT ── ${archiveDate}**\n> Total online: **${archive.total_online ?? 0}**\n\n`;

    if (topUsers.length === 0) {
      description += `**${EMOJI.sparkle} STANDINGS**\n> No operators were active today.\n\n`;
    } else {
      description += `**${EMOJI.crown} TOP OPERATORS**\n`;
      topUsers.forEach((u: any, i: number) => {
        const medal = i === 0 ? EMOJI.crown : i === 1 ? EMOJI.silver : i === 2 ? EMOJI.bronze : `\`${String(i + 1).padStart(2, "0")}\``;
        const solved = u.totalSolvedToday ?? u.todaySolved ?? 0;
        const nameUpper = (u.name || "UNKNOWN").toUpperCase();

        const cfVal = u.cfSolvedToday ?? 0;
        const lcVal = u.lcSolvedToday ?? 0;
        const cfTag = cfVal > 0 ? `${EMOJI.cf} CF: \`${cfVal}\`` : "";
        const lcTag = lcVal > 0 ? `${EMOJI.lc} LC: \`${lcVal}\`` : "";
        const platforms = [cfTag, lcTag].filter(Boolean).join(" | ");
        const platformStr = platforms ? ` ─ ${platforms}` : "";

        description += `> ${medal} **${nameUpper}**: **${solved}** Solved\n> └ ${platformStr}\n`;
      });
      description += `\n`;
    }

    description += `**${EMOJI.stats} DAY SUMMARY**\n`;
    description += `> Total Solved: **${totalSolved}**\n`;
    description += `> ${EMOJI.cf} Codeforces: **${cfSolved}**  |  ${EMOJI.lc} LeetCode: **${lcSolved}**\n`;

    const embed = new EmbedBuilder()
      .setColor(THEME_RED)
      .setDescription(description.trimEnd())
      .setImage(GLITCH_GIF)
      .setFooter({
        text: "COMP_LEAGUE • DAILY SNAPSHOT",
        iconURL: "https://cdn.discordapp.com/emojis/1145727546653970432.gif",
      });

    await channel.send({
      embeds: [embed],
    });

    console.log("Archive posted successfully");
  } catch (err) {
    console.error("Failed to post archive:", err);
  }
};