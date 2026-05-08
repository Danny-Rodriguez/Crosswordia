describe("Create puzzle", () => {
  beforeEach(() => {
    cy.resetDb()
    cy.testLogin()
  })

  it("renders the create page with size buttons", () => {
    cy.visit("/create")
    cy.contains("h1", "Choose your Crossword Size")
    cy.get(".sizeButtons button").should("have.length", 3)
    cy.contains(".sizeButtons button", "5x5")
    cy.contains(".sizeButtons button", "10x10")
    cy.contains(".sizeButtons button", "15x15")
  })

  it("clicking 5x5 renders a 25-cell grid", () => {
    cy.visit("/create")
    cy.contains(".sizeButtons button", "5x5").click()
    cy.get("#crossGrid").should("have.class", "gridSize5")
    cy.get("#crossGrid > .cell5").should("have.length", 25)
  })

  it("POST /crossword persists a puzzle and redirects to /solve/:id", () => {
    cy.intercept("POST", "/crossword").as("createCrossword")

    const payload = {
      name: "API-level Test Puzzle",
      size: 3,
      solution: "CATARETEA",
      hints: {
        1: { cellId: 1, isWordAcross: true, isWordDown: true, acrossHint: "Feline", downHint: "Feline" },
        4: { cellId: 4, isWordAcross: true, acrossHint: "Verb" },
        7: { cellId: 7, isWordAcross: true, acrossHint: "Drink" }
      }
    }

    cy.request({
      method: "POST",
      url: "/crossword",
      body: payload,
      followRedirect: false
    }).then((res) => {
      expect(res.status).to.eq(302)
      expect(res.redirectedToUrl).to.match(/\/solve\/[a-f0-9]{24}$/)
      const id = res.redirectedToUrl.split("/").pop()
      cy.visit(`/solve/${id}`)
      cy.contains("API-level Test Puzzle")
    })
  })

})
