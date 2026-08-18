import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { api } from "../services/api";
import { EMOJI } from "../config/emojis";
import { buildLeaderboardEmbedDescription } from "../services/leaderboardFormatter";

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

    const topUsers = Array.isArray(resData.leaderboard) ? resData.leaderboard.slice(0, 10) : [];
    const stats = resData.stats ?? {
      activeToday: 0,
      solvedToday: 0,
      cfSolvedToday: 0,
      lcSolvedToday: 0,
    };

    const { description, thumbnailUrl } = buildLeaderboardEmbedDescription({
      title: `**${EMOJI.bullet} GLOBAL LEADERBOARD**`,
      subtitle: `> Live standings requested by ${interaction.user.username}.`,
      emptyMessage: `> No operators have solved today yet.`,
      users: topUsers,
      stats,
    });

    const embed = new EmbedBuilder()
      .setColor(THEME_RED)
      .setDescription(description.trimEnd())
      .setImage(GLITCH_GIF)
      .setThumbnail(thumbnailUrl ?? null)
      .setFooter({
        text: "Codango • REALTIME LEADERBOARD",
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
