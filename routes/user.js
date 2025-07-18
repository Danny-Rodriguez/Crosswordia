const express = require("express")
const { ensureAuth } = require("../middleware/auth")
const router = express.Router()
const Crossword = require("../models/Crossword")
const User = require("../models/User")

router.get("/:user", ensureAuth, async (req, res) => {
  let crosswordEntry = await Crossword.find({ user: req.user }).lean()
  // console.log(crosswordEntry)
  return res.render("user", {
    name: req.user.firstName,
    title: "User | Crosswordia",
    cross: crosswordEntry
  })
})

router.post("/:user/fetch", ensureAuth, async (req, res) => {
  let crosswordEntry = await Crossword.find({ user: req.user }).lean()
  // console.log("routes/user.js ", crosswordEntry)
  return res.json(crosswordEntry)
})

router.post("/completed-puzzle", ensureAuth, async (req, res) => {
  try {
    const { puzzleId, timeToComplete } = req.body;

    // Check if user has already completed this puzzle
    const user = await User.findById(req.user.id);
    const alreadyCompleted = user.completedPuzzles.some(
      (puzzle) => puzzle.puzzleId.toString() === puzzleId
    );

    if (!alreadyCompleted) {
      await User.findByIdAndUpdate(req.user.id, {
        $push: {
          completedPuzzles: {
            puzzleId,
            timeToComplete,
          },
        },
      });
    } else {
      // Optionally update the completion time if it's better than previous
      // Implementation depends on requirements
    }

    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router
