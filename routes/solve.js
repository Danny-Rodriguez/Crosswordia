const express = require("express")
const router = express.Router()
const Crossword = require("../models/Crossword")

router.get("/:id", async (req, res) => {
  res.render("solve", {
    layout: "main"
  })
})

router.get("/:id/fetch", async (req, res) => {
  let crosswordEntry = await Crossword.findOne({ _id: req.params.id }).lean()
  res.json(crosswordEntry)
})

module.exports = router
