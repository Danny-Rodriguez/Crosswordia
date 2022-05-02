const express = require("express")
const router = express.Router()

router.get("/", (req, res) => {
  res.render("create", {
    layout: "main"
  })
})

module.exports = router
