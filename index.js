const TelegramBot = require("node-telegram-bot-api");
const env = require("dotenv");
const express = require("express");
env.config();
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

const token = process.env.BOT_API_KEY;
const bot = new TelegramBot(token, { polling: true });
bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  const messageText = msg.text;
  bot.sendMessage(chatId, "Welcome to the bot!");
  // Process the incoming message here
});
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Telegram Bot Is Up And Running ${port}`);
});
