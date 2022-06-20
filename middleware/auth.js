/**
 * Middleware to protect users security
 */
module.exports = {
  // Middleware functions

  ensureAuth: function (req, res, next) {
    // avoid logout when refreshing the page
    if (req.isAuthenticated()) {
      return next()
    } else {
      res.redirect("/login")
    }
  },
  ensureGuest: function (req, res, next) {
    // avoid entering the page before login
    //some change
    if (!req.isAuthenticated()) {
      res.redirect("/login")
    } else {
      return next()
    }
  }
}
