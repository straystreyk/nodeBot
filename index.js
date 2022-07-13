import TelegramBot from "node-telegram-bot-api";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import fetch from "node-fetch";

if (!fs.existsSync(path.resolve("db.json"))) {
  fs.writeFileSync(
    path.resolve("db.json"),
    JSON.stringify({ users: [] }, null, 2)
  );
}

dotenv.config();
import db from "./db.json";
import { re } from "@babel/core/lib/vendor/import-meta-resolve";

const BOT_TOKEN = process.env.BOT_TOKEN;
const NASA_API = process.env.NASA_API_URL + process.env.NASA_API_KEY;
const bot = new TelegramBot(BOT_TOKEN, { polling: true });

const start = async (msg, chatId) => {
  const userInfo = {
    username: msg.from.username,
    firstName: msg.from.first_name,
    isBot: msg.from.is_bot,
    id: msg.from.id,
    languageCode: msg.from.language_code,
    chatId,
  };

  try {
    if (!db.users.find((el) => el.username === msg.from.username)) {
      fs.writeFileSync(
        path.resolve("db.json"),
        JSON.stringify({ users: [...db.users, userInfo] }, null, 2)
      );
    }
  } catch (e) {
    console.log(e.message);
  }

  await bot.sendMessage(chatId, "HI");
};

const stars = async (chatId) => {
  const response = await fetch(NASA_API);
  const data = await response.json();

  await bot.sendMessage(
    chatId,
    ` <strong>Attention!!! I learned how to take the pictures from SPACE!!</strong>
 
I will send people I know a picture from space every day. I assure you this is not just a picture from the Internet.
Friends from NASA helped me make this feature possible. 
Be sure that this picture was taken today (if that's all the claims against NASA). 
I will also attach a description to the picture. 

<strong>Here we go!</strong>
        `,
    {
      parse_mode: "HTML",
    }
  );

  await bot.sendPhoto(chatId, data.url);

  await bot.sendMessage(
    chatId,
    `<b>Date ${new Date(data.date).toLocaleDateString()}</b>

Description: ${data.explanation}

If u want to see the photo in FULL HD, take the link :) - ${data.hdurl}
        `,
    {
      parse_mode: "HTML",
    }
  );
};

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  switch (text) {
    case "/start":
      return await start(msg, chatId);
    case "/stars":
      return await stars(chatId);
    default:
      return await bot.sendMessage(chatId, "I down know what u want :)");
  }
});

setInterval(() => {
  const date = new Date();
  const hours = date.getHours();
  const minute = date.getMinutes();

  if (hours === 19 && minute === 25) {
    db.users.forEach(async (person) => {
      await stars(person.chatId);
    });
  }
}, 45000);
