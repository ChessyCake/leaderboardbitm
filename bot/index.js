import dotenv from "dotenv";
dotenv.config();

import { Client, Events, GatewayIntentBits } from "discord.js";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once(Events.ClientReady, (client) => {
    console.log(`Ready and logged in as ${client.user.tag}`)
})

client.on("messageCreate", async (msg) => {
  if (msg.author.bot) return;

  if (msg.content === "$ping") {
    await msg.reply("pong!");
  }
});

client.login(process.env.BOT_TOKEN);