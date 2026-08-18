import { TextChannel, EmbedBuilder, AttachmentBuilder } from "discord.js";
import { api } from "../services/api";
import { EMOJI } from "../config/emojis";
import { buildLeaderboardEmbedDescription } from "../services/leaderboardFormatter";
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

    const totalSolved = archive.total_solved ?? 0;
    const cfSolved = archive.total_CFsolved ?? 0;
    const lcSolved = archive.total_LCsolved ?? 0;

    const users = topUsers.map((u: any) => ({
      name: u.name,
      todaySolved: u.totalSolvedToday ?? u.todaySolved ?? 0,
      cfSolvedToday: u.cfSolved ?? u.cfSolvedToday ?? 0,
      lcSolvedToday: u.lcSolved ?? u.lcSolvedToday ?? 0,
    }));

    const stats = {
      activeToday: archive.total_online ?? 0,
      solvedToday: totalSolved,
      cfSolvedToday: cfSolved,
      lcSolvedToday: lcSolved,
    };

    const { description, thumbnailUrl } = buildLeaderboardEmbedDescription({
      title: `**${EMOJI.bullet} ARCHIVE SNAPSHOT ── ${archiveDate}**`,
      subtitle: `> Total online: **${stats.activeToday}**`,
      emptyMessage: `> No operators were active today.`,
      users,
      stats,
    });

    const embed = new EmbedBuilder()
      .setColor(THEME_RED)
      .setDescription(description.trimEnd())
      .setImage(GLITCH_GIF)
      .setThumbnail(thumbnailUrl ?? null)
      .setFooter({
        text: "Codango • DAILY SNAPSHOT",
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