const { Schema, model, Types } = require('mongoose')

const User = new Schema({
  id: { type: Types.ObjectId, unique: true, auto: true, },
  chatId: { type: Number, unique: true, },
  right: { type: Number, default: 0, },
  wrong: { type: Number, default: 0, },
})

module.exports = model('User', User)
