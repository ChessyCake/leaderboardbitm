import { Client, Events, Interaction } from "discord.js";
import * as leaderboardCommand from "../commands/leaderboard";

export function registerInteractionEvents(client: Client) {
  client.on(Events.InteractionCreate, async (interaction: Interaction) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === "leaderboard") {
      await leaderboardCommand.execute(interaction);
    }
  });
}
