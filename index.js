import fs from "fs";
import path from "path";

if (!fs.existsSync(path.resolve("db.json"))) {
  fs.writeFileSync(
    path.resolve("db.json"),
    JSON.stringify({ users: [] }, null, 2)
  );
}

import { bot } from "./bot";
import { reminder, stars, start } from "./controllers";
import { commands } from "./constants/commands";
import db from "./db.json";
import { sendRemind } from "./controllers/reminder";

const startBot = async () => {
  await bot.setMyCommands(commands);

  bot.on("message", async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    switch (text) {
      case "/start":
        return await start(msg, chatId);
      case "/stars":
        return await stars(chatId);
      case "/reminder":
        return await reminder(msg.message_id, chatId);
      // default:
      //   return await bot.sendMessage(chatId, "I dont know what u want :)");
    }
  });

  setInterval(() => {
    const date = new Date();
    const hours = date.getHours();
    const minutes = date.getMinutes();

    if (db.reminders && db.reminders.length) {
      sendRemind();
    }

    if (hours === 19 && minutes === 25) {
      db.users.forEach(async (person) => {
        await stars(person.chatId);
      });
    }
  }, 100);
};

startBot();
