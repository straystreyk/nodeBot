import fetch from "node-fetch";
import { bot } from "../bot";

const NASA_API = process.env.NASA_API_URL + process.env.NASA_API_KEY;

export const stars = async (chatId) => {
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
