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

bot.setWebHook(process.env.WebHook_URL);

app.post("/telegram-webhook", async (req, res) => {
  let Body = await req.body;
  // console.log(Body);
  let CHAT_ID = await Body.message.from.id;
  // console.log(CHAT_ID);
  let CHAT_Text = await Body.message.text;
  try {
    if (CHAT_Text === "/start") {
      await bot.sendMessage(CHAT_ID, "Welcome To The World Of AI");
      // res.status(200).send("OKAY");
    } else {
      const result = await chatSession.sendMessage(CHAT_Text);
      // console.log(result.response.text());
      await bot.sendMessage(CHAT_ID, result.response.text());
      // res.status(200).send("OKAY");
    }
  } catch (error) {
    await bot.sendMessage(
      CHAT_ID,
      "Sorry Some Interrupt Happened On My Side Please Continue To See If It Is Happening Again Or Not...."
    );
    // res.status(200).send("OKAY");
  }
  res.sendStatus(200);
});

app.get("/", (req, res) => {
  res.send("YYayy.....Finally The CHATBOT Is Working......");
});

app.listen(port, () => {
  console.log(`Telegram Bot Is Up And Running ${port}`);
});
