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
      db.reminders.forEach(async (person) => {
        const remindDate = new Date(
          person.remindTime * 1000
        ).toLocaleDateString();
        const hours = new Date(person.remindTime * 1000).getHours();
        const minutes = new Date(person.remindTime * 1000).getMinutes();
        if (
          remindDate === new Date().toLocaleDateString() &&
          hours === new Date().getHours() &&
          minutes === new Date().getMinutes()
        ) {
          await fs.writeFile(
            path.resolve("db.json"),
            JSON.stringify(
              { ...db, reminders: db.reminders.filter((el) => el !== person) },
              null,
              2
            ),
            () => {
              console.log("Deleted");
            }
          );
          await bot.sendMessage(person.chatId, person.text);
        }
      });
    }

    if (hours === 19 && minutes === 25) {
      db.users.forEach(async (person) => {
        await stars(person.chatId);
      });
    }
  }, 60000);
};

startBot();
