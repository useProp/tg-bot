require('dotenv').config()
import TelegramBot, {CallbackQuery, ChatId, Message} from "node-telegram-bot-api";
import TelegramApi from 'node-telegram-bot-api'
const mongoose = require('mongoose')

const User = require('./models/User')
import {commands} from "./commands";
import {BotHelper} from "./BotHelper";

const bot: TelegramBot = new TelegramApi(process.env.TG_BOT_TOKEN as string, { polling: true })

const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.DB_MONGO_URI, { useNewUrlParser: true, })
    console.log('Database successfully connected')
  } catch (e) {
    console.log(`Error while DB connection :(`, e)
    process.exit(1)
  }
}

const start = async () => {
  await dbConnect()
  const botHelper = new BotHelper(bot, User)
  await bot.setMyCommands(commands)

  bot.on('message', async (msg: Message) => {
    const text = msg.text || ''
    const chatId: ChatId = msg.chat.id

    try {
      if (text === '/start') {
        return botHelper.start(chatId)
      }

      if (text === '/info') {
        return botHelper.info(chatId)
      }

      if (text === '/game') {
        return botHelper.startGame(chatId)
      }
    } catch (e) {
      console.log(e)
      return bot.sendMessage(chatId, 'Woops... Something went wrong :(')
    }

    return bot.sendMessage(chatId, 'I don\'t understand you')
  })

  bot.on('callback_query', async (msg: CallbackQuery) => {
    const data = msg.data || ''
    const chatId = msg.message!.chat.id

    if (data === '/again') {
      return botHelper.startGame(chatId)
    }

    try {
      return botHelper.chats[chatId] === Number(data) ? botHelper.rightAnswer(chatId, data) : botHelper.wrongAnswer(chatId)
    } catch (e) {
      console.log(e)
      return bot.sendMessage(chatId, 'Woops... Something went wrong :(')
    }
  })
}

start().then()

