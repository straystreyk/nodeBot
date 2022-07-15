import fs from "fs";
import path from "path";
import { bot } from "../bot";
import db from "../db.json";

export const start = async (msg, chatId) => {
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
    await bot.sendMessage(chatId, "Glad to see you :)");
  } catch (e) {
    console.log(e.message);
    await bot.sendMessage(chatId, "Something went wrong :(");
  }
};
