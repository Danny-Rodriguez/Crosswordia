const express = require("express");
const router = express.Router();
const { ensureAuth, ensureGuest } = require("../middleware/auth");
const Crossword = require("../models/Crossword");
const User = require("../models/User");
const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));

let layoutValue;

// @desc home page
// @route Get /
router.get("/", ensureAuth, async (req, res) => {
  try {
    // Get user with populated completed puzzles
    const user = await User.findById(req.user.id).populate(
      "completedPuzzles.puzzleId"
    );

    // Get puzzles created count
    const puzzlesCreated = await Crossword.countDocuments({ user: req.user.id });
    
    // Calculate best time if there are completed puzzles
    let bestTime = '-';
    if (user.completedPuzzles && user.completedPuzzles.length > 0) {
      // Find the minimum time to complete
      const minTime = Math.min(...user.completedPuzzles
        .filter(puzzle => puzzle.timeToComplete) // Filter out any undefined times
        .map(puzzle => puzzle.timeToComplete));
      
      if (minTime !== Infinity) {
        // Format time as minutes:seconds
        const minutes = Math.floor(minTime / 60);
        const seconds = minTime % 60;
        bestTime = `${minutes}:${seconds.toString().padStart(2, '0')}`;
      }
    }
    
    // Create stats object for the view
    const stats = {
      totalCompleted: user.completedPuzzles ? user.completedPuzzles.length : 0,
      recentlyCompleted: user.completedPuzzles ? user.completedPuzzles.slice(-3) : [],
      puzzlesCreated: puzzlesCreated,
      bestTime: bestTime
    };

    return res.render("home", {
      layout: "main",
      title: "Home | Crosswordia",
      name: req.user.firstName,
      stats: stats
    });
  } catch (error) {
    console.error(error);
    return res.render("home", {
      layout: "main",
      title: "Home | Crosswordia",
      name: req.user.firstName
    });
  }
});

// @desc create page
// @route Get /create
router.get("/create", ensureAuth, async (req, res) => {
  return res.render("create", {
    layout: "main",
    title: "Create | Crosswordia"
  });
});

// @desc login page
// @route Get /login
router.get("/login", ensureGuest, async (req, res) => {
  return res.render("login", {
    layout: "mainGuest",
    title: "Login | Crosswordia"
  });
});

// @desc login page after clicking create
// @route Get /login-create
router.get("/login-create", ensureGuest, async (req, res) => {
  return res.render("login-create", {
    layout: "mainGuest",
    title: "Login | Crosswordia"
  });
});

// @desc Delete function
// @route Get /delete(:id)
router.get("/delete/:id", ensureAuth, async (req, res) => {
  Crossword.findByIdAndDelete(req.params.id, (err, doc) => {
    if (!err) {
      return res.redirect("/user/" + req.user.id);
    } else {
      return console.log("Failed to Delete user Details: " + err);
    }
  });
});

// @desc gallery page
// @route Get /gallery
router.get("/gallery", async (req, res) => {
  req.isAuthenticated() ? (layoutValue = "main") : (layoutValue = "mainGuest");
  return res.render("gallery", {
    title: "Gallery | Crosswordia",
    layout: layoutValue
  });
});

// @desc user page
// @route Get /user
router.get("/user", ensureAuth, async (req, res) => {
  try {
    return res.redirect(`/user/` + req.user.id);
  } catch (error) {
    return console.error(error);
  }
});

// @desc about page
//@ route Get /about
router.get("/about", async (req, res) => {
  req.isAuthenticated() ? (layoutValue = "main") : (layoutValue = "mainGuest");
  return res.render("about", {
    title: "About | Crosswordia",
    layout: layoutValue
  });
});

router.post("/crossword", ensureAuth, async (req, res) => {
  try {
    const toPost = {
      user: req.user.id,
      name: req.body.name,
      size: req.body.size,
      solution: req.body.solution,
      hints: req.body.hints
    };
    const newCrossword = await Crossword.create(toPost);
    return res.redirect(`/solve/` + newCrossword._id);
  } catch (error) {
    return console.error(error);
  }
});

router.post("/dictionary", async (req, res) => {
  const word = JSON.stringify(req.body.word);
  const dictApi = process.env.DICTIONARYAPI_KEY;
  try {
    await fetch(`https://www.dictionaryapi.com/api/v3/references/thesaurus/json/${word}?key=${dictApi}`)
      .then(res => res.json())
      .then(result => {
        return res.json(result);
      });
  } catch (error) {
    return console.error("/dictionary error: " + error);
  }
});

module.exports = router;
