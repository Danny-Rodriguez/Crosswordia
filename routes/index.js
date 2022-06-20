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
  console.log(req.body)

  try {
    let toPost = {
      googleId: req.user.googleId,
      size: req.body.size,
      solution: req.body.solution,
      hints: req.body.hints
    }
    let newCrossword = await Crossword.create(toPost)
    res.redirect(`/solve/` + newCrossword._id)
  } catch (error) {}
})

module.exports = router
