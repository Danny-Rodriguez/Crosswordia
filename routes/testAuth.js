const express = require("express");
const router = express.Router();
const User = require("../.claude/worktrees/flamboyant-heisenberg-d9cd31/models/User");
const Crossword = require("../.claude/worktrees/flamboyant-heisenberg-d9cd31/models/Crossword");

const FIXTURE_GOOGLE_ID = "e2e-fixture-user";

router.post("/login", async (req, res) => {
  try {
    let user = await User.findOne({ googleId: FIXTURE_GOOGLE_ID });
    if (!user) {
      user = await User.create({
        googleId: FIXTURE_GOOGLE_ID,
        displayName: "E2E User",
        firstName: "E2E",
        lastName: "User",
        image: "",
      });
    }
    req.login(user, (err) => {
      if (err) return res.status(500).json({ error: err.message });
      return res.json({ id: user.id });
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.post("/reset", async (req, res) => {
  try {
    await User.deleteMany({});
    await Crossword.deleteMany({});
    return res.json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.post("/seed-puzzle", async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: "Not authenticated" });
    const { name, size, solution, hints } = req.body;
    const puzzle = await Crossword.create({
      user: req.user.id,
      name,
      size,
      solution,
      hints,
    });
    return res.json({ id: puzzle.id });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
