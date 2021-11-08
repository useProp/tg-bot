const TelegramApi = require('node-telegram-bot-api')

const { gameOptions, againOptions } = require('./options')
const sequelize = require('./db')
const User = require('./models/User')

const token = '2069355701:AAG4P2VF5H1Y_S4cvq0MoItaTZo0FZOAjqM'
const bot = new TelegramApi(token, { polling: true })
const chats = {}

const dbConnection = async () => {
  try {
    await sequelize.authenticate()
    await sequelize.sync()
  } catch (e) {
    console.log(`DB connection error: ${e}`)
  }
}

const startGame = async chatId => {
  await bot.sendMessage(chatId, 'Guess a number: Try to guess a random number from 0 to 9')
  const randomNumber = Math.floor(Math.random() * 10)
  chats[chatId] = randomNumber
  await bot.sendMessage(chatId, 'You can start :)', gameOptions)
}

const start = async () => {
  await dbConnection()

  bot.setMyCommands([
    {command: '/start', description: 'Start conversation'},
    {command: '/info', description: 'Get your information'},
    {command: '/game', description: 'Random number game'},
  ])


  bot.on('message', async msg => {
    const text = msg.text
    const chatId = msg.chat.id

    try {
      if (text === '/start') {
        const user = await User.findOne({ chatId })
        console.log(`user: ${user}`)
        if (!user) {
          await User.create({ chatId })
        }
        await bot.sendSticker(chatId, 'https://tlgrm.eu/_/stickers/e1d/7e1/e1d7e170-0e83-4b0e-9bfd-83150380e736/2.webp')
        return bot.sendMessage(chatId, `Hello, I am FirstBot :)`)
      }

      if (text === '/info') {
        const user = await User.findOne({ chatId })
        console.log(user)
        return bot.sendMessage(chatId, `Your score is r: ${user.right} w: ${user.wrong}`)
      }

      if (text === '/game') {
        return startGame(chatId)
      }
    } catch (e) {
      console.log(e)
      return bot.sendMessage(chatId, 'Woops... Something went wrong :(')
    }

    return bot.sendMessage(chatId, 'I don\'t understand you')
  })

  bot.on('callback_query', async msg => {
    const data = msg.data
    const chatId = msg.message.chat.id

    if (data === '/again') {
      return startGame(chatId)
    }

    const user = await User.findOne({ chatId })
    if (chats[chatId] === Number(data)) {
      user.right += 1
      await bot.sendMessage(chatId, `Congratulations, ${data} it\'s right answer! :)`, againOptions)
    } else {
      user.wrong += 1
      await bot.sendMessage(chatId, 'Nope, try again :)', againOptions)
    }

    await user.save()
  })
}

start()

