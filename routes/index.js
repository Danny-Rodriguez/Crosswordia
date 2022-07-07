const express = require("express")
const router = express.Router()
const { ensureAuth, ensureGuest } = require("../middleware/auth")
const Crossword = require("../models/Crossword")

// @desc Login/Landing page
// @route Get /
router.get("/", ensureAuth, async (req, res) => {
  res.render("home", {
    layout: "main"
  })
})

// @desc login page
// @ Route Get /login
router.get("/login", async (req, res) => {
  res.render("login", {
    layout: "main"
  })
})

router.post("/crossword", ensureAuth, async (req, res) => {
  try {
    var toPost = {
      googleId: req.user.googleId,
      size: req.body.size,
      solution: req.body.solution,
      hints: req.body.hints
    }
    var newCrossword = await Crossword.create(toPost)

    res.redirect(`/solve/` + newCrossword._id)
  } catch (error) {
    console.error(error)
  }
})

router.post("/user", async (req, res) => {
  try {
    // let crosswordEntry = await Crossword.findOne({ _id: req.params.id }).lean()
    // var userPage = document.getElementById("userPage")
    // let crosswordEntry2 = await Crossword.find({ googleId: req.user.googleId }, { _id: 1 }).lean()
    // var idArr = []

    // // res.json(crosswordEntry2)
    // // console.log(req.params.id)
    // // console.log(crosswordEntry2[0]._id.toJSON())

    // for (var i = 0; i < crosswordEntry2.length; i++) {
    //   idArr.push(crosswordEntry2[i]._id.toJSON())

    // }
    // console.log(idArr)
    // // res.json(idArr)
    res.redirect(`/user/` + req.user.googleId)
  } catch (error) {
    console.error(error)
  }
})

module.exports = router
