const express = require("express")
const { ensureAuth, ensureAuth2 } = require("../middleware/auth")
const router = express.Router()
const Crossword = require("../models/Crossword")

router.get("/:id", ensureAuth2, async (req, res) => {
  if (ensureAuth2) {
    res.render("solve", {
      layout: "main"
    })
  }
})

router.get("/:id/fetch", async (req, res) => {
  // let size
  // let googleId = req.user.googleId
  // let _id = req.params.id
  // console.log("This is routes/solve.js /:id/fetch")
  let crosswordEntry = await Crossword.findOne({ _id: req.params.id }).lean()
  // let crosswordEntry2 = await Crossword.find({ googleId: req.user.googleId }, { _id: 1 }).lean()
  // console.log(crosswordEntry)
  res.json(crosswordEntry)
  // console.log(req.params.id)
  // console.log(crosswordEntry2[0]._id.toJSON())
  // for (var i = 0; i < crosswordEntry2.length; i++) {
  //   console.log(crosswordEntry2[i]._id.toJSON())
  // }

  // res.json(crosswordEntry2)
})

module.exports = router
