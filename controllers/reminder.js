import { bot } from "../bot";
import db from "../db.json";
import fs from "fs";
import path from "path";

export const reminder = async (msgId, chatId) => {
  const sentMsg = await bot.sendMessage(
    chatId,
    "Send me the date in the format - year.month.day, hh:mm, 'remind text'. If you won't write a year or a month I'll choose the current month or the current year",
    {
      reply_markup: {
        force_reply: true,
      },
    }
  );

  bot.onReplyToMessage(sentMsg.chat.id, sentMsg.message_id, (msg) => {
    const arrayDate = msg.text.replace(/ /g, "").split(",");
    const date = arrayDate[0];
    const time = arrayDate[1];
    const text = arrayDate[2];

    const remindTime = Date.parse(`${date} ${time}`) / 1000;

    if (db) {
      fs.writeFileSync(
        path.resolve("db.json"),
        JSON.stringify(
          {
            ...db,
            reminders: db.reminders
              ? [...db.reminders, { chatId, remindTime, text }]
              : [{ chatId, remindTime, text }],
          },
          null,
          2
        )
      );
    }

    bot.sendMessage(sentMsg.chat.id, "I'll remind you, be sure!");
  });
};
