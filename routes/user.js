const express = require("express")
const router = express.Router()
// const { ensureAuth, ensureGuest } = require("../middleware/auth")
const Crossword = require("../models/Crossword")

// // @desc User Page
// // @ Route Get /user
// router.get("/user", async (req, res) => {
//   res.render("user", {
//     layout: "main"
//   })
// })

// router.get("/:id", async (req, res) => {
router.get("/:googleId", async (req, res) => {
  res.render("user", {
    layout: "main"
  })
})

// router.get("/:id/fetch", async (req, res) => {
router.get("/:googleId/fetch", async (req, res) => {
  console.log("this is routes/user.js /fetch")
  let crosswordEntry = await Crossword.findOne({ googleId: req.user.googleId }).lean()
  // let crosswordEntry2 = await Crossword.find({ googleId: req.user.googleId }, { _id: 1 }).lean()
  let crosswordEntry2 = await Crossword.find({ googleId: req.user.googleId }).lean()
  var idArr = []
  var idObj = {}

  // res.json(crosswordEntry2)
  // console.log(req.params.id)
  // console.log(crosswordEntry2[0]._id.toJSON())

  for (var i = 0; i < crosswordEntry2.length; i++) {
    idArr.push(crosswordEntry2[i]._id.toJSON())
    // idObj[i] = crosswordEntry2[i]._id.toJSON()
    // console.log(crosswordEntry2[i]._id.toJSON())
  }
  console.log(crosswordEntry2)
  console.log(idArr)
  // res.json(idArr)
  res.json(crosswordEntry2)
})

module.exports = router