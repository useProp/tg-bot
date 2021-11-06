const TelegramApi = require('node-telegram-bot-api')
const { gameOptions, againOptions } = require('./options')

const token = '2069355701:AAG4P2VF5H1Y_S4cvq0MoItaTZo0FZOAjqM'
const bot = new TelegramApi(token, { polling: true })
const chats = {}

const startGame = async chatId => {
  bot.setMyCommands([
    {command: '/start', description: 'Start conversation'},
    {command: '/info', description: 'Get your information'},
    {command: '/game', description: 'Random number game'},
  ])

  await bot.sendMessage(chatId, 'Guess a number: Try to guess a random number from 0 to 9')
  const randomNumber = Math.floor(Math.random() * 10)
  chats[chatId] = randomNumber
  await bot.sendMessage(chatId, 'You can start :)', gameOptions)
}

const start = () => {
  bot.on('message', async msg => {
    const text = msg.text
    const chatId = msg.chat.id

    if (text === '/start') {
      await bot.sendSticker(chatId, 'https://tlgrm.eu/_/stickers/e1d/7e1/e1d7e170-0e83-4b0e-9bfd-83150380e736/2.webp')
      return bot.sendMessage(chatId, `Hello, I am FirstBot :)`)
    }

    if (text === '/info') {
      return bot.sendMessage(chatId, `Your name is ${msg.from.first_name} ${msg.from.username}`)
    }

    if (text === '/game') {
      return startGame(chatId)
    }

    return bot.sendMessage(chatId, 'I don\'t understand you')
  })

  bot.on('callback_query', async msg => {
    const data = msg.data
    const chatId = msg.message.chat.id

    if (data === '/again') {
      return startGame(chatId)
    }

    if (chats[chatId] === Number(data)) {
      return bot.sendMessage(chatId, `Congratulations, ${data} it\'s right answer! :)`, againOptions)
    } else {
      return bot.sendMessage(chatId, 'Nope, try again :)', againOptions)
    }
  })
}

start()

