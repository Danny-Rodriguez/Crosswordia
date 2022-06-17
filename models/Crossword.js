const mongoose = require("mongoose")

const Crossword = new mongoose.Schema({
  size: {
    type: Number,
    required: true
  },
  solution: {
    type: String,
    required: true
  },
  googleId: {
    type: String,
    required: true
  },
  hints: {
    type: Object
  }
})

module.exports = mongoose.model("Crossword", Crossword)
