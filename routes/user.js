const express = require("express")
const { ensureAuth } = require("../middleware/auth")
const router = express.Router()
const Crossword = require("../models/Crossword")

// router.get("/:id", async (req, res) => {
router.get("/:googleId", ensureAuth, async (req, res) => {
  res.render("user", {
    layout: "main"
  })
})

// router.get("/:id/fetch", async (req, res) => {
router.get("/:googleId/fetch", ensureAuth, async (req, res) => {
  let crosswordEntry = await Crossword.find({ googleId: req.user.googleId }).lean()

  res.json(crosswordEntry)
})

module.exports = router
