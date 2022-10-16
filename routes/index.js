const express = require("express")
const router = express.Router()
const { ensureAuth, ensureGuest } = require("../middleware/auth")
const Crossword = require("../models/Crossword")
const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args))

// @desc home page
// @route Get /
router.get("/", ensureAuth, async (req, res) => {
  return res.render("home", {
    layout: "main",
    title: "Home | Crosswordia",
    name: req.user.firstName
  })
})

// @desc create page
// @route Get /create
router.get("/create", ensureAuth, async (req, res) => {
  return res.render("create", {
    layout: "main",
    title: "Create | Crosswordia"
  })
})

// @desc login page
// @route Get /login
router.get("/login", ensureGuest, async (req, res) => {
  return res.render("login", {
    layout: "mainGuest",
    title: "Login | Crosswordia"
  })
})

// @desc Delete function
// @route Get /delete(:id)
router.get("/delete/:id", ensureAuth, async (req, res) => {
  Crossword.findByIdAndDelete(req.params.id, (err, doc) => {
    if (!err) {
      return res.redirect("/user/" + req.user.id)
    } else {
      return console.log("Failed to Delete user Details: " + err)
    }
  })
})

// @desc gallery page
// @route Get /gallery
router.get("/gallery", ensureAuth, async (req, res) => {
  return res.render("gallery", {
    title: "Gallery | Crosswordia"
  })
})

// @desc user page
// @route Get /user
router.get("/user", ensureAuth, async (req, res) => {
  try {
    return res.redirect(`/user/` + req.user.id)
  } catch (error) {
    return console.error(error)
  }
})

// @desc about page
//@ route Get /about
router.get("/about", async (req, res) => {
  let layoutValue
  req.isAuthenticated() ? (layoutValue = "main") : (layoutValue = "mainGuest")
  return res.render("about", {
    layout: layoutValue,
    title: "About | Crosswordia"
  })
})

router.post("/crossword", ensureAuth, async (req, res) => {
  try {
    let toPost = {
      user: req.user.id,
      name: req.body.name,
      size: req.body.size,
      solution: req.body.solution,
      hints: req.body.hints
    }
    let newCrossword = await Crossword.create(toPost)
    // console.log(res.redirect(`/solve/` + newCrossword._id))
    return res.redirect(`/solve/` + newCrossword._id)
  } catch (error) {
    return console.error(error)
  }
})

router.post("/dictionary", async (req, res) => {
  let word = JSON.stringify(req.body.word)
  let dictApi = process.env.DICTIONARYAPI_KEY
  try {
    const toFetch = await fetch(`https://www.dictionaryapi.com/api/v3/references/thesaurus/json/${word}?key=${dictApi}`)
      .then(res => res.json())
      .then(result => {
        return res.json(result)
      })
  } catch (error) {
    return console.error("/dictionary error: " + error)
  }
})

// router.all("*", (req, res) => {
//   res.status(404)
//   return res.render("error/404", {
//     layout: "mainGuest"
//   })
// })

module.exports = router
