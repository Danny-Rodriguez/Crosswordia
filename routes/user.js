const express = require("express")
const { ensureAuth } = require("../middleware/auth")
const router = express.Router()
const Crossword = require("../models/Crossword")

router.get("/:googleId", ensureAuth, async (req, res) => {
  return res.render("user", {
    layout: "main"
  })
})

router.get("/:googleId/fetch", ensureAuth, async (req, res) => {
  let crosswordEntry = await Crossword.find({ googleId: req.user.googleId }).lean()

  return res.json(crosswordEntry)
})

module.exports = router
