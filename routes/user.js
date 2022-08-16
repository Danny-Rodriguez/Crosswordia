const express = require("express")
const { ensureAuth } = require("../middleware/auth")
const router = express.Router()
const Crossword = require("../models/Crossword")

router.get("/:user", ensureAuth, async (req, res) => {
  return res.render("user", {
    name: req.user.firstName
  })
})

router.get("/:user/fetch", ensureAuth, async (req, res) => {
  let crosswordEntry = await Crossword.find({ user: req.user }).lean()
  // console.log("routes/user.js ", crosswordEntry)
  return res.json(crosswordEntry)
})

module.exports = router
