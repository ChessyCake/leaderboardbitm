import {
  Client,
  Events,
  GatewayIntentBits,
  TextChannel,
} from "discord.js";
import dotenv from "dotenv";

import { registerMessageEvents } from "./events/messageCreate";
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
    // Run immediately once
    await currentStats(livestats as TextChannel);
    await postLiveLeaderboard(livestats as TextChannel);

    // Schedule every 5 minutes
    cron.schedule("*/5 * * * *", async () => {
      console.log("[CRON] Running live stats & leaderboard update...");
      await currentStats(livestats as TextChannel);
      await postLiveLeaderboard(livestats as TextChannel);
    });
  }

  if (getleaderachive?.isTextBased()) {
    // Schedule for 23:55 every day
    cron.schedule("55 23 * * *", async () => {
      console.log("[CRON] Running daily archive post...");
      await postDailyArchive(getleaderachive as TextChannel);
    });
  }
});

registerMessageEvents(client);
registerInteractionEvents(client);

client.login(process.env.BOT_TOKEN);