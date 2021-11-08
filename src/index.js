"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
require('dotenv').config();
var node_telegram_bot_api_1 = require("node-telegram-bot-api");
var mongoose = require('mongoose');
var User = require('./models/User');
var commands_1 = require("./commands");
var BotHelper_1 = require("./BotHelper");
var bot = new node_telegram_bot_api_1["default"](process.env.TG_BOT_TOKEN, { polling: true });
var dbConnect = function () { return __awaiter(void 0, void 0, void 0, function () {
    var e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, mongoose.connect(process.env.DB_MONGO_URI, { useNewUrlParser: true })];
            case 1:
                _a.sent();
                console.log('Database successfully connected');
                return [3 /*break*/, 3];
            case 2:
                e_1 = _a.sent();
                console.log("Error while DB connection :(", e_1);
                process.exit(1);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
var start = function () { return __awaiter(void 0, void 0, void 0, function () {
    var botHelper;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, dbConnect()];
            case 1:
                _a.sent();
                botHelper = new BotHelper_1.BotHelper(bot, User);
                return [4 /*yield*/, bot.setMyCommands(commands_1.commands)];
            case 2:
                _a.sent();
                bot.on('message', function (msg) { return __awaiter(void 0, void 0, void 0, function () {
                    var text, chatId;
                    return __generator(this, function (_a) {
                        text = msg.text || '';
                        chatId = msg.chat.id;
                        try {
                            if (text === '/start') {
                                return [2 /*return*/, botHelper.start(chatId)];
                            }
                            if (text === '/info') {
                                return [2 /*return*/, botHelper.info(chatId)];
                            }
                            if (text === '/game') {
                                return [2 /*return*/, botHelper.startGame(chatId)];
                            }
                        }
                        catch (e) {
                            console.log(e);
                            return [2 /*return*/, bot.sendMessage(chatId, 'Woops... Something went wrong :(')];
                        }
                        return [2 /*return*/, bot.sendMessage(chatId, 'I don\'t understand you')];
                    });
                }); });
                bot.on('callback_query', function (msg) { return __awaiter(void 0, void 0, void 0, function () {
                    var data, chatId;
                    return __generator(this, function (_a) {
                        data = msg.data || '';
                        chatId = msg.message.chat.id;
                        if (data === '/again') {
                            return [2 /*return*/, botHelper.startGame(chatId)];
                        }
                        try {
                            return [2 /*return*/, botHelper.chats[chatId] === Number(data) ? botHelper.rightAnswer(chatId, data) : botHelper.wrongAnswer(chatId)];
                        }
                        catch (e) {
                            console.log(e);
                            return [2 /*return*/, bot.sendMessage(chatId, 'Woops... Something went wrong :(')];
                        }
                        return [2 /*return*/];
                    });
                }); });
                return [2 /*return*/];
        }
    });
}); };
start().then();
