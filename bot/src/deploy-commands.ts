import { REST, Routes } from "discord.js";
import dotenv from "dotenv";
import { data as leaderboardCommandData } from "./commands/leaderboard";

dotenv.config();

const commands = [leaderboardCommandData.toJSON()];

const rest = new REST({ version: "10" }).setToken(process.env.BOT_TOKEN!);

(async () => {
  try {
    console.log(`Started refreshing ${commands.length} application (/) commands.`);

    if (!process.env.CLIENT_ID) {
        throw new Error("CLIENT_ID is missing in .env");
    }

    const data: any = await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands }
    );

    console.log(`Successfully reloaded ${data.length} application (/) commands.`);
  } catch (error) {
    console.error(error);
  }
})();
