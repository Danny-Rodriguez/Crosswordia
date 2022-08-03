const express = require("express")
const { ensureAuth, ensureAuth2 } = require("../middleware/auth")
const router = express.Router()
const Crossword = require("../models/Crossword")

router.get("/:id", ensureAuth2, async (req, res, next) => {
  try {
    let crosswordEntry = await Crossword.findOne({ _id: req.params.id }).lean()
  } catch (error) {
    // console.log("Get /:id")
    res.status(404)
    return res.render("error/404", {
      layout: "mainGuest"
    })
    // next("")
  }
  if (ensureAuth2) {
    return res.render("solve", {
      layout: "main"
    })
  }
  // else {
  //   return res.render("solve", {
  //     layout: "mainGuest"
  //   })
  // }
})

router.get("/:id/fetch", async (req, res) => {
  try {
    var crosswordEntry = await Crossword.findOne({ _id: req.params.id }).lean()
  } catch (error) {
    console.log("Get /:id/fetch")
    res.status(404)
    return res.render("error/404", {
      layout: "mainGuest"
    })
  }
  return res.json(crosswordEntry)
})

router.all("*", (req, res) => {
  res.status(404)
  return res.render("error/404", {
    layout: "mainGuest"
  })
})

module.exports = router
