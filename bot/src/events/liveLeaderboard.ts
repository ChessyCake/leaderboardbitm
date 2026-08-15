import { TextChannel, Message, EmbedBuilder } from "discord.js";
import { api } from "../services/api";
import { EMOJI } from "../config/emojis";
import { buildLeaderboardEmbedDescription } from "../services/leaderboardFormatter";

const LEADERBOARD_MESSAGE_ID = process.env.LEADERBOARD_MESSAGE_ID!;


const THEME_RED = 0xff0000;
const GLITCH_GIF = "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExM2t5YjI4ZjNqYTVuMGd3cXRiOTJiYmRzb2VveHF5ZmdrMnNyM3piYiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/gDskvfTWoYEnK/giphy.gif";

export const postLiveLeaderboard = async (channel: TextChannel) => {
  const { data } = await api.get("/internal/bot/leaderboard");

  if (!data.success) {
    console.log("Backend error on leaderboard");
    return;
  }

  const leaderboard = Array.isArray(data.leaderboard) ? data.leaderboard.slice(0, 3) : [];
  const stats = data.stats ?? {
    activeToday: 0,
    solvedToday: 0,
    cfSolvedToday: 0,
    lcSolvedToday: 0,
  };

  const { description, thumbnailUrl } = buildLeaderboardEmbedDescription({
    title: `**${EMOJI.bullet} LIVE LEADERBOARD**`,
    subtitle: "> Top 3 operators updated in real-time.",
    emptyMessage: `> No operators have solved today yet.`,
    users: leaderboard,
    stats,
    requestedBy: null,
  });

  const embed = new EmbedBuilder()
    .setColor(THEME_RED)
    .setDescription(description.trimEnd())
    .setImage(GLITCH_GIF)
    .setThumbnail(thumbnailUrl ?? null)
    .setFooter({
      text: "CodeStack • LIVE LEADERBOARD",
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
