import { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } from "discord.js";
import { api } from "../services/api";
import path from "path";
import { fileURLToPath } from "url";

// ── Resolve asset path ──
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const BANNER_PATH = path.join(__dirname, "..", "assets", "stats_banner.png");

// ── Theme ──
const NEON_CYAN = 0x00f0ff;

export const data = new SlashCommandBuilder()
  .setName("leaderboard")
  .setDescription("Shows the top 10 users on the leaderboard.");

export const execute = async (interaction: any) => {
  await interaction.deferReply();

  try {
    const { data: resData } = await api.get("/internal/bot/leaderboard");

    if (!resData.success) {
      return interaction.editReply("Failed to fetch leaderboard.");
    }

    const topUsers = resData.leaderboard.slice(0, 10);
    const stats = resData.stats;

    // ── Attach banner image ──
    const bannerAttachment = new AttachmentBuilder(BANNER_PATH, {
      name: "leaderboard_banner.png",
    });

    // ── Build leaderboard entries ──
    let entries = "";

    if (topUsers.length === 0) {
      entries = "> *No operators have solved today yet. Be the first!*\n";
    } else {
      topUsers.forEach((u: any, i: number) => {
        const medal =
          i === 0 ? "👑" : i === 1 ? "🥈" : i === 2 ? "🥉" : `\`${String(i + 1).padStart(2, "0")}\``;
        const cfTag = u.cfSolvedToday > 0 ? `🟠 CF:\`${u.cfSolvedToday}\`` : "";
        const lcTag = u.lcSolvedToday > 0 ? `🟡 LC:\`${u.lcSolvedToday}\`` : "";
        const platforms = [cfTag, lcTag].filter(Boolean).join("  ") || "─";
        const streakDisplay = u.streak > 0 ? `  🔥 \`${u.streak}\`` : "";
        const solvedBar = "▰".repeat(Math.min(u.todaySolved || 1, 8)) + "▱".repeat(Math.max(8 - (u.todaySolved || 1), 0));

        if (i < 3) {
          entries += `> ${medal}  **${u.name}**\n`;
          entries += `> \`${solvedBar}\` **${u.todaySolved}** solved ─ ${platforms}${streakDisplay}\n\n`;
        } else {
          entries += `> ${medal}  **${u.name}** ── **${u.todaySolved}** solved ─ ${platforms}${streakDisplay}\n`;
        }
      });
    }

    // ── Build full description ──
    let desc = "";

    desc += `### 🏆 ── TOP OPERATORS\n\n`;
    desc += entries;
    desc += `\n### 📊 ── TODAY'S STATS\n\n`;

    desc += `> 👥 **Active Today** ──── **\`${stats.activeToday}\`**\n`;
    desc += `> ⚡ **Total Solved** ──── **\`${stats.solvedToday}\`**\n`;
    desc += `> 🟠 **CF Solved** ─────── **\`${stats.cfSolvedToday}\`**\n`;
    desc += `> 🟡 **LC Solved** ─────── **\`${stats.lcSolvedToday}\`**\n\n`;

    desc += `-# Requested by ${interaction.user.username} • Data from CF & LC APIs`;

    const embed = new EmbedBuilder()
      .setColor(NEON_CYAN)
      .setAuthor({
        name: "COMP_LEAGUE ⚡ LEADERBOARD",
        iconURL: "https://cdn.discordapp.com/emojis/1145727546653970432.gif",
      })
      .setTitle("⚡ ── LEADERBOARD ── ⚡")
      .setDescription(desc)
      .setImage("attachment://leaderboard_banner.png")
      .setFooter({
        text: "COMP_LEAGUE • REALTIME LEADERBOARD • v2.1",
        iconURL: "https://cdn.discordapp.com/emojis/1145727546653970432.gif",
      })
      .setTimestamp();

    await interaction.editReply({
      embeds: [embed],
      files: [bannerAttachment],
    });
  } catch (error) {
    console.error(error);
    await interaction.editReply("An error occurred while fetching the leaderboard.");
  }
};
