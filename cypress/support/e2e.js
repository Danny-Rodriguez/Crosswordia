import "./commands"

Cypress.on("uncaught:exception", (err) => {
  if (/GrowlNotification|simple-keyboard|addtoany/i.test(err.message)) return false
  return true
})
