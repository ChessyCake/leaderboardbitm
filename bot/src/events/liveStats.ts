import { TextChannel, Message, EmbedBuilder, AttachmentBuilder } from "discord.js";
import { api } from "../services/api";
import { EMOJI } from "../config/emojis";
import path from "path";
import { fileURLToPath } from "url";

const STATS_MESSAGE_ID = process.env.STATS_MESSAGE_ID!;

// ── Resolve asset path ──
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const BANNER_PATH = path.join(__dirname, "..", "assets", "stats_banner.png");

// ── Theme ──
const THEME_RED = 0xff0000;
const GLITCH_GIF = "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExMzNicXJkOWtpdWt4MjZqMjl0bjBteGFrNnYyYzFkb2k4dmtrNXZuMyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/VLzbEtlbwJUFljcRbf/giphy.gif";

export const currentStats = async (channel: TextChannel) => {
  const { data } = await api.get("/internal/bot/stats");

  if (!data.success) {
    console.log("Backend error");
    return;
  }

  const s = data.stats;

  // Banner removed in favor of Glitch GIF

  // Calculate total solved
  const totalSolved = (s.totalCFSolvedToday || 0) + (s.totalLCSolvedToday || 0);

  // Fetch guild members to populate cache (requires GuildMembers + GuildPresences intents)
  try {
    await channel.guild.members.fetch();
  } catch {
    // If it fails, we'll just show 0
  }
  const onlineCount = channel.guild.members.cache.filter(m => !m.user.bot && m.presence && m.presence.status !== 'offline').size || 0;

  // ── Build the charming description ──
  const description = [
    `*Welcome to the daily Statsly update! Let's see how the squad is doing today.* 🤍\n`,
    `**${EMOJI.users} COMMUNITY STATUS**`,
    `> Total Registered: **${s.studentsOnline ?? 0}**`,
    `> Currently Online: **${onlineCount}**`,
    ``,
    `**${EMOJI.bolt} DAILY TALLY**`,
    `> LeetCode Solved: **${s.totalLCSolvedToday ?? 0}**`,
    `> Codeforces Solved: **${s.totalCFSolvedToday ?? 0}**`,
    `> Total Solved Today: **${totalSolved}**`,
    ``,
    `**${EMOJI.fire} ENGAGEMENT**`,
    `> Active Operators: **${s.activeToday ?? 0}**`,
    `> Active Streaks: **${s.totalActiveStreaks ?? 0}**\n`,
    `*If You Need Help Or Spot A Bug Ping Mods/Admins*`
  ].join('\n');

  // ── Build the embed ──
  const embed = new EmbedBuilder()
    .setColor(THEME_RED)
    .setDescription(description)
    .setImage(GLITCH_GIF)
    .setFooter({
      text: "Have A Great Day • STATSLY", 
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

    // Attempt to find the message dynamically if the ID fails
    if (!msg) {
      const messages = await channel.messages.fetch({ limit: 50 });
      msg = messages.find(
        (m) =>
          m.author.id === channel.client.user?.id &&
          m.embeds.length > 0 &&
          m.embeds[0]?.footer?.text?.includes("STATSLY")
      );
    }

    if (msg) {
      await msg.edit({
        content: `The daily leaderboard metrics are in! 🚀`,
        embeds: [embed],
        files: [], 
      });
      console.log("Stats message updated");
    } else {
      const newMsg = await channel.send({
        content: `**@everyone** The daily leaderboard metrics are in! 🚀`,
        embeds: [embed],
      });
      console.log("Created stats message:", newMsg.id);
      console.log("Put this in .env as STATS_MESSAGE_ID");
    }
  } catch (err) {
    console.error("Error with stats message:", err);
  }
};