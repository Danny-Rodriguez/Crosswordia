const mongoose = require("mongoose")

const Confirmation = new mongoose.Schema({
  test: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model("Confirmation", Confirmation)
