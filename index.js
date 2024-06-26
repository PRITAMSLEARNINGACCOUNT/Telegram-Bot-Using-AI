const TelegramBot = require("node-telegram-bot-api");
const env = require("dotenv");
const express = require("express");
env.config();
const app = express();
const port = process.env.PORT || 3000;
const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction:
    "You are a helper from every aspect as well as a boyfreind of the person you are talking to.so give the responses properly with proper accuracy.otherwise you already know that how girlfreinds are nowdays so be careful",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

const chatSession = model.startChat({
  generationConfig,
  history: [],
});

const token = process.env.BOT_API_KEY;
const bot = new TelegramBot(token, { polling: true });
bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const messageText = msg.text;
  const result = await chatSession.sendMessage(messageText);
  bot.sendMessage(chatId, result.response.text());
});
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Telegram Bot Is Up And Running ${port}`);
});
