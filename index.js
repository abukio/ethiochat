const OpenAI = require("openai")
const translator = require("open-google-translator");
translator.supportedLanguages();
const TelegramBot = require('node-telegram-bot-api');
const axios = require("axios");
let lang = "";
require('dotenv').config();

const express = require('express')
const app = express()

app.get('/', function (req, res) {
  res.send('Hello World')
})

const port = process.env.PORT || 9001;
app.listen(port, () => {
  console.log(`server is running at http://localhost:${port}`)
})

const openai=new OpenAI({
    apiKey:process.env.API_KEY
})

const token = "6268861887:AAFxPJXpMBH_xKeLCkY3PIlE4QaMi2Qt3VU";
const bot = new TelegramBot(token, {polling: true});
bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const userInput = msg.text;
    const messageText = msg.text;
    if (messageText === '/om') {
        bot.sendMessage(chatId, 'Afaanichi milkaa\'inaan jijjiiramee jira!');
        lang = 'om'
    } else if (messageText === '/am') {
        bot.sendMessage(chatId, 'ቋንቋው በተሳካ ሁኔታ ቀይረዋል!');
        lang = 'am'
    } 

    const engTran = await translator
    .TranslateLanguageData({
        listOfWordsToTranslate: [userInput],
        fromLanguage: lang,
        toLanguage: "en",
    });
    // .then((data) => {
    //     //const engTran = data[0].translation;
    //     console.log(data[0].translation)
    // });
    //console.log(engTran[0].translation)
    const response= await openai.chat.completions.create({
        model:'gpt-3.5-turbo',
        messages:[{"role":"user","content":engTran[0].translation}],
        max_tokens:100
    })
    //console.log(response.choices[0].message.content)
    translator
    .TranslateLanguageData({
        listOfWordsToTranslate: [response.choices[0].message.content],
        fromLanguage: "en",
        toLanguage: lang,
    })
    .then((data) => {
        //console.log(data[0].translation);
        bot.sendMessage(chatId, data[0].translation);
    });
});
