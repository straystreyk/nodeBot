import fetch from "node-fetch";
import { bot } from "../bot";

const NASA_API = process.env.NASA_API_URL + process.env.NASA_API_KEY;

export const stars = async (chatId) => {
  const response = await fetch(NASA_API);
  const data = await response.json();

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
