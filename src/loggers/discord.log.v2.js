"use strict";

const { Client, GatewayIntentBits } = require("discord.js");

class LoggerService {
  constructor() {
    this.client = new Client({
      intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
      ],
    });
    // add chanelId
    this.channelId = process.env.DISCORD_CHANNEL_ID;
    this.client.on("ready", () => {
      console.log(`Logged in as ${this.client.user.tag}`);
    });
    this.client.login(process.env.DISCORD_BOT_TOKEN);
  }
  sendToFormatCode(logData) {
    // add default value
    const {
      code,
      message = "This is some additional information about the code",
      title = "Code example",
    } = logData;
    const codeMessage = {
      content: message,
      embeds: [
        {
          color: parseInt("0x0099ff"),
          title,
          description: "```json\n" + JSON.stringify(code, null, 2) + "\n```",
        },
      ],
    };
    const channel = this.client.channels.cache.get(this.channelId);
    if (!channel) return console.log("Channel not found");
    channel.send(codeMessage).catch((e) => console.log(e));
  }
  sendToMessage(message = "message") {
    const channel = this.client.channels.cache.get(this.channelId);
    if (!channel) return console.log("Channel not found");
    channel.send(message).catch((e) => console.log(e));
  }
}

module.exports = new LoggerService();
