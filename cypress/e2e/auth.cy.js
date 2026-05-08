describe("Test-auth seam", () => {
  beforeEach(() => {
    cy.resetDb()
    cy.testLogin()
  })

  it("logs in via /__test__/login and renders the home page with the user name", () => {
    cy.visit("/")
    cy.contains("h1", "Hello E2E, welcome to Crosswordia!")
    cy.contains("Your Crossword Journey")
    cy.contains(".stat-label", "Puzzles Completed")
    cy.contains(".stat-label", "Puzzles Created")
    cy.contains(".stat-label", "Best Time")
  })

  it("shows zeroed stats when the user has no activity yet", () => {
    cy.visit("/")
    cy.contains(".stat-label", "Puzzles Completed")
      .siblings(".stat-value")
      .should("have.text", "0")
    cy.contains(".stat-label", "Puzzles Created")
      .siblings(".stat-value")
      .should("have.text", "0")
    cy.contains(".stat-label", "Best Time")
      .siblings(".stat-value")
      .should("have.text", "-")
  })
})
