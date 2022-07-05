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

router.post("/crossword", async (req, res) => {
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

module.exports = router
