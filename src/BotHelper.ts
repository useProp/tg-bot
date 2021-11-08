import TelegramBot from 'node-telegram-bot-api'
import {Model} from "mongoose";
import {againOptions, gameOptions} from "./options";
import {ChatId} from "node-telegram-bot-api";
const User = require('./models/User')

export class BotHelper {
  private userModel: Model<typeof User>;
  private bot: TelegramBot;
  chats: { [key: string]: number } = {}
  constructor(bot: TelegramBot, user: Model<typeof User>) {
    this.userModel = user
    this.bot = bot
  }

  startGame = async (chatId: ChatId) => {
    await this.bot.sendMessage(chatId, 'Try to guess a random number from 0 to 9')
    this.chats[chatId] = Math.floor(Math.random() * 10)
    await this.bot.sendMessage(chatId, 'You can start :)', gameOptions)
  }

  start = async (chatId: ChatId) => {
    const isUserExist = await this.userModel.findOne({ chatId })
    if (!isUserExist) {
      await this.userModel.create({ chatId })
    }

    await this.bot.sendSticker(chatId, 'https://tlgrm.eu/_/stickers/e1d/7e1/e1d7e170-0e83-4b0e-9bfd-83150380e736/2.webp')
    await this.bot.sendMessage(chatId, `Hello, I am FirstBot :)`)
  }

  info = async (chatId: ChatId) => {
    const user = await this.userModel.findOne({ chatId })
    await this.bot.sendMessage(chatId, `Your score is r: ${user.right} w: ${user.wrong}`)
  }

  rightAnswer = async (chatId: ChatId, selectedNumber: string) => {
    const user = await this.userModel.findOne({chatId})
    user.right += 1
    await user.save()
    await this.bot.sendMessage(chatId, `Congratulations, ${selectedNumber} it\'s right answer! :)`, againOptions)
  }

  wrongAnswer = async (chatId: ChatId) => {
    const user = await this.userModel.findOne({chatId})
    user.wrong += 1
    await user.save()
    await this.bot.sendMessage(chatId, `Nope, try again :)`, againOptions)
  }

}
