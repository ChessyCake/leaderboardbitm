import {
  Client,
  Events,
  GatewayIntentBits,
  TextChannel,
} from "discord.js";
import dotenv from "dotenv";

import { registerInteractionEvents } from "./events/interactionCreate";
import { currentStats } from "./events/liveStats";
import { postLiveLeaderboard } from "./events/liveLeaderboard";
import { postDailyArchive } from "./events/dailyArchive";
import cron from "node-cron";

dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMembers,
  ],
});

client.once(Events.ClientReady, async (e) => {
  console.log(`Ready! logged in as ${e.user.tag}`);

  const livestats = await client.channels.fetch(
    "1534778642687725720"
  );

  const getleaderachive = await client.channels.fetch(
    "1535605184514756608"
  )

  if (livestats?.isTextBased()) {
    await currentStats(livestats as TextChannel);
    await postLiveLeaderboard(livestats as TextChannel);
    cron.schedule("* * * * *", async () => {
      console.log("[CRON] Running live stats & leaderboard update...");
      await currentStats(livestats as TextChannel);
      await postLiveLeaderboard(livestats as TextChannel);
    });
  }

  if (getleaderachive?.isTextBased()) {
    cron.schedule("5 0 * * *", async () => {
      console.log("[CRON] Running daily archive post...");
      await postDailyArchive(getleaderachive as TextChannel);
    });
  }
});

registerInteractionEvents(client);

client.login(process.env.BOT_TOKEN);