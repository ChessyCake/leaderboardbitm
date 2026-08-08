import { Client, Events } from "discord.js";

export function registerMessageEvents( client: Client){
    client.on(Events.MessageCreate, async(msg) => {
        if(msg.author.bot) return

        if(msg.content === "$hello"){
            await msg.reply(`Hi ${msg.author} hope you are doing great!`)
        }
    })
}