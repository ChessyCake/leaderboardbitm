import { TextChannel, Message, EmbedBuilder } from "discord.js";
import { api } from "../services/api";
import { EMOJI } from "../config/emojis";

const LEADERBOARD_MESSAGE_ID = process.env.LEADERBOARD_MESSAGE_ID!;


const THEME_RED = 0xff0000;
const GLITCH_GIF = "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExM2t5YjI4ZjNqYTVuMGd3cXRiOTJiYmRzb2VveHF5ZmdrMnNyM3piYiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/gDskvfTWoYEnK/giphy.gif";

export const postLiveLeaderboard = async (channel: TextChannel) => {
  const { data } = await api.get("/internal/bot/leaderboard");

  if (!data.success) {
    console.log("Backend error on leaderboard");
    return;
  }

  const leaderboard = data.leaderboard.slice(0, 3);
  const stats = data.stats;


  let description = `**${EMOJI.bullet} LIVE LEADERBOARD**\n> Top 3 operators updated in real-time.\n\n`;

  if (leaderboard.length === 0) {
    description += `**${EMOJI.sparkle} STANDINGS**\n> No operators have solved today yet.\n\n`;
  } else {
    description += `**${EMOJI.crown} TOP OPERATORS**\n`;
    leaderboard.forEach((u: any, i: number) => {
      const medal = i === 0 ? EMOJI.crown : i === 1 ? EMOJI.silver : EMOJI.bronze;
      const cfTag = u.cfSolvedToday > 0 ? `${EMOJI.cf} CF: \`${u.cfSolvedToday}\`` : "";
      const lcTag = u.lcSolvedToday > 0 ? `${EMOJI.lc} LC: \`${u.lcSolvedToday}\`` : "";
      const platforms = [cfTag, lcTag].filter(Boolean).join(" | ") || "─";
      const streakDisplay = u.streak > 0 ? ` | ${EMOJI.fire} \`${u.streak}\`` : "";

      description += `> ${medal} **${u.name}**: **${u.todaySolved}** Solved\n> └ ${platforms}${streakDisplay}\n`;
    });
    description += `\n`;
  }

  description += `**${EMOJI.stats} TODAY'S STATS**\n`;
  description += `> Active Operators: **${stats.activeToday}**\n`;
  description += `> Total Solved: **${stats.solvedToday}**\n`;
  description += `> ${EMOJI.cf} CF: **${stats.cfSolvedToday}** | ${EMOJI.lc} LC: **${stats.lcSolvedToday}**\n`;

  const embed = new EmbedBuilder()
    .setColor(THEME_RED)
    .setDescription(description.trimEnd())
    .setImage(GLITCH_GIF)
    .setFooter({
      text: "COMP_LEAGUE • LIVE LEADERBOARD",
      iconURL: "https://cdn.discordapp.com/emojis/1145727546653970432.gif",
    });

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
          m.embeds[0]?.footer?.text?.includes("LIVE LEADERBOARD")
      );
    }

    if (msg) {
      await msg.edit({
        content: null,
        embeds: [embed],
        files: [],
      });
      console.log("Live leaderboard message updated");
    } else {
      const newMsg = await channel.send({
        embeds: [embed],
      });
      console.log("Created live leaderboard message:", newMsg.id);
      console.log("Put this in .env as LEADERBOARD_MESSAGE_ID");
    }
  } catch (err) {
    console.error("Error with live leaderboard message:", err);
  }
};
