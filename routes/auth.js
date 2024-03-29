const express = require("express");
const passport = require("passport");
const router = express.Router();

// @desc  Auth with Google
// @route  GET /auth/google
router.get("/google", passport.authenticate("google", { scope: ["profile"] }));

// @desc  Google Auth Callback
// @route  GET /auth/google/callback
router.get("/google/callback", passport.authenticate("google", { failureRedirect: "/login" }), (req, res) => {
  res.redirect("/");
});

// @desc   Logout user
// @route  /auth/logout
router.get("/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
  });
  res.redirect("/gallery");
});

module.exports = router;
