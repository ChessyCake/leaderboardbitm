import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { api } from "../services/api";
import { EMOJI } from "../config/emojis";

const THEME_RED = 0xff0000;
const GLITCH_GIF = "https://media.giphy.com/media/xT9IgzoKnwFNmISR8I/giphy.gif";

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


    let description = `**${EMOJI.bullet} GLOBAL LEADERBOARD**\n> Live standings requested by ${interaction.user.username}.\n\n`;

    if (topUsers.length === 0) {
      description += `**${EMOJI.sparkle} STANDINGS**\n> No operators have solved today yet.\n\n`;
    } else {
      description += `**${EMOJI.crown} TOP OPERATORS**\n`;
      topUsers.forEach((u: any, i: number) => {
        const medal = i === 0 ? EMOJI.crown : i === 1 ? EMOJI.silver : i === 2 ? EMOJI.bronze : `\`${String(i + 1).padStart(2, "0")}\``;
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
        text: "COMP_LEAGUE • REALTIME LEADERBOARD",
        iconURL: "https://cdn.discordapp.com/emojis/1145727546653970432.gif",
      });

    await interaction.editReply({
      embeds: [embed],
    });
  } catch (error) {
    console.error(error);
    await interaction.editReply("An error occurred while fetching the leaderboard.");
  }
};
