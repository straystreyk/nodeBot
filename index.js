import fs from "fs";
import path from "path";

if (!fs.existsSync(path.resolve("db.json"))) {
  fs.writeFileSync(
    path.resolve("db.json"),
    JSON.stringify({ users: [] }, null, 2)
  );
}

import { bot } from "./bot";
import { stars, start } from "./controllers";
import db from "./db.json";

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
  const minutes = date.getMinutes();

  if (hours === 19 && minutes === 25) {
    db.users.forEach(async (person) => {
      await stars(person.chatId);
    });
  }
}, 45000);
