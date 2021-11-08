import {BotCommand} from "node-telegram-bot-api";

export const commands: BotCommand[] = [
  {command: '/start', description: 'Start conversation'},
  {command: '/info', description: 'Get your information'},
  {command: '/game', description: 'Random number game'},
]
