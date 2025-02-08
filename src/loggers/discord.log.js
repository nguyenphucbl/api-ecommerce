"use strict";

const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});
const token =
  "MTMzNzA1MDk3MzQxOTQ3MDg4OA.GWfoMs.JWaWQCXRYDTmWw9R56qLu2B-Z1TYlNJ49IecLU";
client.login(token);

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (message.content === "hello") {
    message.reply("Hello, how can I help you?");
  }
});
