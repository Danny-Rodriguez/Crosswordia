const express = require("express")
const router = express.Router()

router.get("/", (req, res) => {
  res.render("UserLoggedIn", {
    layout: "main"
  })
})

module.exports = router
