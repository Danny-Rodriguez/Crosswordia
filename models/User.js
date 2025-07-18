const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
  googleId: {
    type: String,
    required: true
  },
  displayName: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  image: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  completedPuzzles: [
    {
      puzzleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Crossword"
      },
      completedAt: {
        type: Date,
        default: Date.now
      },
      timeToComplete: {
        type: Number // Time in seconds
      }
    }
  ]
})

module.exports = mongoose.model("User", UserSchema)
