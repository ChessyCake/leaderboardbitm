import { TextChannel, Message, EmbedBuilder, AttachmentBuilder } from "discord.js";
import { api } from "../services/api";
import path from "path";
import { fileURLToPath } from "url";

const STATS_MESSAGE_ID = process.env.STATS_MESSAGE_ID!;

// ── Resolve asset path ──
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const BANNER_PATH = path.join(__dirname, "..", "assets", "stats_banner.png");

// ── Theme ──
const NEON_GREEN = 0xccff00;

export const currentStats = async (channel: TextChannel) => {
  const { data } = await api.get("/internal/bot/stats");

  if (!data.success) {
    console.log("Backend error");
    return;
  }

  const s = data.stats;

  // ── Attach banner image ──
  const bannerAttachment = new AttachmentBuilder(BANNER_PATH, {
    name: "stats_banner.png",
  });

  // ── Progress bar helper ──
  const bar = (val: number, max: number) => {
    const filled = Math.min(10, Math.max(0, Math.round((val / Math.max(max, 1)) * 10)));
    return "▰".repeat(filled) + "▱".repeat(10 - filled);
  };

  const totalSolved = (s.totalCFSolvedToday ?? 0) + (s.totalLCSolvedToday ?? 0);

  // ── Build the embed ──
  const embed = new EmbedBuilder()
    .setColor(NEON_GREEN)
    .setAuthor({
      name: "COMP_LEAGUE ⚡ LIVE DASHBOARD",
      iconURL: "https://cdn.discordapp.com/emojis/1145727546653970432.gif",
    })
    .setTitle("⟨⚡⟩ ── SYSTEM MONITOR ── ⟨⚡⟩")
    .setDescription(
      `### 📡 ── LIVE METRICS\n\n` +

      `> 👥 **Operators Online**\n` +
      `> \`${bar(s.studentsOnline ?? 0, s.studentsOnline ?? 1)}\` **${s.studentsOnline ?? 0}**\n\n` +

      `> ⚡ **Active Today**\n` +
      `> \`${bar(s.activeToday ?? 0, s.studentsOnline ?? 1)}\` **${s.activeToday ?? 0}**\n\n` +

      `### 🏆 ── SOLVE TRACKER\n\n` +

      `> 🟠 **Codeforces** ── \`${s.totalCFSolvedToday ?? 0}\` solved\n` +
      `> \`${bar(s.totalCFSolvedToday ?? 0, totalSolved || 1)}\`\n\n` +

      `> 🟡 **LeetCode** ── \`${s.totalLCSolvedToday ?? 0}\` solved\n` +
      `> \`${bar(s.totalLCSolvedToday ?? 0, totalSolved || 1)}\`\n\n` +

      `> 🔥 **Active Streaks** ── **${s.totalActiveStreaks ?? 0}**\n\n` +

      `-# Updated every 5 minutes • Data synced from CF & LC APIs`
    )
    .setImage("attachment://stats_banner.png")
    .setFooter({
      text: "COMP_LEAGUE • SYSTEM MONITOR v2.1",
      iconURL: "https://cdn.discordapp.com/emojis/1145727546653970432.gif",
    })
    .setTimestamp();

  try {
    let msg: Message | undefined;

    if (STATS_MESSAGE_ID) {
      try {
        msg = await channel.messages.fetch(STATS_MESSAGE_ID);
      } catch (err) {
        console.log("Could not fetch stats message by ID from .env");
      }
    }

    if (!msg) {
      const messages = await channel.messages.fetch({ limit: 50 });
      msg = messages.find(
        (m) =>
          m.author.id === channel.client.user?.id &&
          m.embeds.length > 0 &&
          (m.embeds[0].title?.includes("SYSTEM MONITOR") || m.embeds[0].title?.includes("GLOBAL_STATS"))
      );
    }

    if (msg) {
      await msg.edit({
        content: null,
        embeds: [embed],
        files: [bannerAttachment],
      });
      console.log("Stats message updated");
    } else {
      const newMsg = await channel.send({
        embeds: [embed],
        files: [bannerAttachment],
      });
      console.log("Created stats message:", newMsg.id);
      console.log("Put this in .env as STATS_MESSAGE_ID");
    }
  } catch (err) {
    console.error("Error with stats message:", err);
  }
};