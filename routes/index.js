const express = require("express")
const router = express.Router()

// @desc Login/Landing page
// @route Get /
router.get("/", (req, res) => {
  res.render("login", {
    layout: "main"
  })
})

// @desc Logged in Page
// @route GET /userLoggedIn
router.get("/", (req, res) => {
  res.render("userLoggedIn", {
    layout: "main"
  })
})

module.exports = router
