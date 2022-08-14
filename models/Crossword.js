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
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  hints: {
    type: Object,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true
  }
})

module.exports = mongoose.model("Crossword", Crossword)
