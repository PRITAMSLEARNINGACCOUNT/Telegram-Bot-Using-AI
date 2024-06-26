const TelegramBot = require("node-telegram-bot-api");
const env = require("dotenv");
env.config();
const token = process.env.BOT_API_KEY;
const bot = new TelegramBot(token, { polling: true });
bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  const messageText = msg.text;
  bot.sendMessage(chatId, "Welcome to the bot!");
  // Process the incoming message here
});
