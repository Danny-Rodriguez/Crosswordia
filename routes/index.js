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
// @route Get /login
router.get("/login", async (req, res) => {
  res.render("login", {
    layout: "mainGuest"
  })
})

// @desc Delete function
// @route Get /delete(:id)
router.get("/delete/:id", ensureAuth, async (req, res) => {
  Crossword.findByIdAndDelete(req.params.id, (err, doc) => {
    if (!err) {
      res.redirect("/user/" + req.user.googleId)
    } else {
      console.log("Failed to Delete user Details: " + err)
    }
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

router.get("/profile", ensureAuth, async (req, res) => {
  var firstName = req.user.firstName
  var image = req.user.image
  var profileObj = { firstName, image }
  console.log(profileObj)
  res.json(profileObj)
})

router.post("/user", ensureAuth, async (req, res) => {
  try {
    res.redirect(`/user/` + req.user.googleId)
  } catch (error) {
    console.error(error)
  }
})

module.exports = router
