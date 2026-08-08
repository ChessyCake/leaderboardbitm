import { TextChannel, Message, EmbedBuilder, AttachmentBuilder } from "discord.js";
import { api } from "../services/api";
import path from "path";
import { fileURLToPath } from "url";

const LEADERBOARD_MESSAGE_ID = process.env.LEADERBOARD_MESSAGE_ID!;

// ── Resolve asset path ──
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const BANNER_PATH = path.join(__dirname, "..", "assets", "stats_banner.png");

// ── Theme ──
const NEON_CYAN = 0x00f0ff;

export const postLiveLeaderboard = async (channel: TextChannel) => {
  const { data } = await api.get("/internal/bot/leaderboard");

  if (!data.success) {
    console.log("Backend error on leaderboard");
    return;
  }

  const leaderboard = data.leaderboard.slice(0, 3);
  const stats = data.stats;

  // ── Attach banner ──
  const bannerAttachment = new AttachmentBuilder(BANNER_PATH, {
    name: "lb_banner.png",
  });

  // ── Build the top 3 entries ──
  let entries = "";

  if (leaderboard.length === 0) {
    entries = "> *No operators have solved today yet. Be the first!*\n";
  } else {
    leaderboard.forEach((u: any, i: number) => {
      const medal = i === 0 ? "👑" : i === 1 ? "🥈" : "🥉";
      const cfTag = u.cfSolvedToday > 0 ? `🟠 CF:\`${u.cfSolvedToday}\`` : "";
      const lcTag = u.lcSolvedToday > 0 ? `🟡 LC:\`${u.lcSolvedToday}\`` : "";
      const platforms = [cfTag, lcTag].filter(Boolean).join("  ") || "─";
      const streakDisplay = u.streak > 0 ? `  🔥 \`${u.streak}\`` : "";
      const solvedBar = "▰".repeat(Math.min(u.todaySolved || 1, 8)) + "▱".repeat(Math.max(8 - (u.todaySolved || 1), 0));

      entries += `> ${medal}  **${u.name}**\n`;
      entries += `> \`${solvedBar}\` **${u.todaySolved}** solved ─ ${platforms}${streakDisplay}\n\n`;
    });
  }

  // ── Build description ──
  let desc = "";

  desc += `### 🏆 ── TODAY'S TOP 3\n\n`;
  desc += entries;

  desc += `### 📊 ── TODAY'S STATS\n\n`;
  desc += `> 👥 **Active Today** ──── **\`${stats.activeToday}\`**\n`;
  desc += `> ⚡ **Total Solved** ──── **\`${stats.solvedToday}\`**\n`;
  desc += `> 🟠 **CF Solved** ─────── **\`${stats.cfSolvedToday}\`**\n`;
  desc += `> 🟡 **LC Solved** ─────── **\`${stats.lcSolvedToday}\`**\n\n`;

  desc += `-# Updated every 5 minutes • Data synced from CF & LC APIs`;

  const embed = new EmbedBuilder()
    .setColor(NEON_CYAN)
    .setAuthor({
      name: "COMP_LEAGUE ⚡ LEADERBOARD",
      iconURL: "https://cdn.discordapp.com/emojis/1145727546653970432.gif",
    })
    .setTitle("⟨🏆⟩ ── TOP 3 OPERATORS ── ⟨🏆⟩")
    .setDescription(desc)
    .setImage("attachment://lb_banner.png")
    .setFooter({
      text: "COMP_LEAGUE • LIVE LEADERBOARD • v2.1",
      iconURL: "https://cdn.discordapp.com/emojis/1145727546653970432.gif",
    })
    .setTimestamp();

  try {
    let msg: Message | undefined;

    if (LEADERBOARD_MESSAGE_ID) {
      try {
        msg = await channel.messages.fetch(LEADERBOARD_MESSAGE_ID);
      } catch (err) {
        console.log("Could not fetch leaderboard message by ID from .env");
      }
    }

    if (!msg) {
      const messages = await channel.messages.fetch({ limit: 50 });
      msg = messages.find(
        (m) =>
          m.author.id === channel.client.user?.id &&
          m.embeds.length > 0 &&
          (m.embeds[0].title?.includes("TOP 3 OPERATORS") || m.embeds[0].title?.includes("TOP_3_OPERATORS"))
      );
    }

    if (msg) {
      await msg.edit({
        content: null,
        embeds: [embed],
        files: [bannerAttachment],
      });
      console.log("Live leaderboard message updated");
    } else {
      const newMsg = await channel.send({
        embeds: [embed],
        files: [bannerAttachment],
      });
      console.log("Created live leaderboard message:", newMsg.id);
      console.log("Put this in .env as LEADERBOARD_MESSAGE_ID");
    }
  } catch (err) {
    console.error("Error with live leaderboard message:", err);
  }
};
