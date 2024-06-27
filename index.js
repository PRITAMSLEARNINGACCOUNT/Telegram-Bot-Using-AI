const TelegramBot = require("node-telegram-bot-api");
const env = require("dotenv");
const express = require("express");
env.config();
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
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
const bot = new TelegramBot(token);
// bot.on("message", async (msg) => {
//   try {
//     const chatId = msg.chat.id;
//     const messageText = msg.text;
//     const result = await chatSession.sendMessage(messageText);
//     bot.sendMessage(chatId, result.response.text());
//   } catch (error) {
//     console.log(error);
//   }
// });

bot.setWebHook(`https://telegram-bot-using-ai.vercel.app/telegram-webhook`);

app.post("/telegram-webhook", async (req, res) => {
  // bot.processUpdate(req.body);
  let Body = req.body;
  let CHAT_ID = Body.message.from.id;
  let CHAT_Text = Body.message.text;
  const result = await chatSession.sendMessage(CHAT_Text);
  // console.log(CHAT_ID, CHAT_Text);
  if (CHAT_Text === "/start") {
    bot.sendMessage(CHAT_ID, "Welcome To The World Of AI");
  } else {
    bot.sendMessage(CHAT_ID, result.response.text());
  }
  res.sendStatus(200);
});

app.get("/", (req, res) => {
  res.send("YYayy.....Now You Can Make Your Own Chatbot");
});

app.listen(port, () => {
  console.log(`Telegram Bot Is Up And Running ${port}`);
});
