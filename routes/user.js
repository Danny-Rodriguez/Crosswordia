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
    console.log("Received completion data:", req.body);
    const { puzzleId, timeToComplete } = req.body;
    
    if (!puzzleId) {
      return res.status(400).json({ error: "Missing puzzleId" });
    }

    console.log("User ID:", req.user.id);
    // Check if user has already completed this puzzle
    const user = await User.findById(req.user.id);
    console.log("User found:", !!user);
    
    // Check if completedPuzzles exists, if not initialize it
    if (!user.completedPuzzles) {
      user.completedPuzzles = [];
    }
    
    const alreadyCompleted = user.completedPuzzles.some(
      (puzzle) => puzzle.puzzleId && puzzle.puzzleId.toString() === puzzleId
    );
    console.log("Already completed:", alreadyCompleted);

    if (!alreadyCompleted) {
      console.log("Adding new completion record");
      const result = await User.findByIdAndUpdate(req.user.id, {
        $push: {
          completedPuzzles: {
            puzzleId,
            timeToComplete,
          },
        },
      }, { new: true });
      console.log("Update result:", !!result);
    } else {
      // Optionally update the completion time if it's better than previous
      console.log("Puzzle already completed, not updating");
      // Implementation depends on requirements
    }

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Error in completed-puzzle route:", err);
    res.status(500).json({ error: "Server error", message: err.message });
  }
});

module.exports = router
