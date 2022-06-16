const express = require("express")
const router = express.Router()

router.get("/", (req, res) => {
  res.render("userLoggedIn", {
    layout: "main"
  })
})

router.post("/", (req, res, next) => {
  console.log(req.body)
  res.send(req.body)
  next()
})
router.use("/", (req, res) => {
  console.log(req.body)
})

module.exports = router
