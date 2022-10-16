const express = require("express")
const router = express.Router()
const Crossword = require("../models/Crossword")

router.get("/:id", async (req, res, next) => {
  let layoutValue
  req.isAuthenticated() ? (layoutValue = "main") : (layoutValue = "mainGuest")

  try {
    let crosswordEntry = await Crossword.findOne({ _id: req.params.id }).lean()
  } catch (error) {
    res.status(404)
    return res.render("error/404", {
      layout: layoutValue,
      title: "404 | Solve"
    })
  }

  return res.render("solve", {
    layout: layoutValue,
    title: "Solve | Crosswordia"
  })
})

router.post("/:id/fetch", async (req, res) => {
  let crosswordEntry = await Crossword.findOne({ _id: req.params.id }).lean()
  // console.log(crosswordEntry)
  return res.json(crosswordEntry)
})

module.exports = router
