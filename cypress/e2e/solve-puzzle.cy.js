describe("Solve puzzle", () => {
  beforeEach(() => {
    cy.resetDb()
    cy.testLogin()
  })

  it("loads a seeded puzzle and intercepts /fetch", () => {
    cy.seedPuzzle("puzzle-3x3.json").then((puzzleId) => {
      cy.intercept("POST", `/solve/${puzzleId}/fetch`).as("fetchPuzzle")
      cy.visit(`/solve/${puzzleId}`)
      cy.wait("@fetchPuzzle").its("response.body").should((body) => {
        expect(body.name).to.eq("Tiny Test Puzzle")
        expect(body.size).to.eq(3)
        expect(body.solution).to.eq("CATARETEA")
      })
      cy.get("#crossGrid").should("have.class", "gridSize3")
      cy.get("#crossGrid > .cell3").should("have.length", 9)
      cy.contains("Tiny Test Puzzle")
      cy.contains("#hints-across", "Feline pet")
    })
  })

  it("does not crash when /fetch returns a malformed response", () => {
    cy.seedPuzzle("puzzle-3x3.json").then((puzzleId) => {
      cy.intercept("POST", `/solve/${puzzleId}/fetch`, {
        statusCode: 200,
        body: {}
      }).as("fetchBroken")
      cy.visit(`/solve/${puzzleId}`, { failOnStatusCode: false })
      cy.wait("@fetchBroken")
      cy.get("body").should("be.visible")
    })
  })

  it("submits a completion record when the puzzle is solved", () => {
    cy.seedPuzzle("puzzle-3x3.json").then((puzzleId) => {
      cy.intercept("POST", "/user/completed-puzzle").as("completion")
      cy.visit(`/solve/${puzzleId}`)
      cy.get("#crossGrid > .cell3").should("have.length", 9)

      cy.window().then((win) => {
        const solution = "CATARETEA"
        for (let i = 0; i < 9; i++) {
          const cell = win.document.getElementById(String(i + 1))
          const pLetter = cell.querySelector("p.pLetter3")
          if (pLetter) pLetter.textContent = solution.charAt(i)
        }
      })

      cy.get(".checkBtn").click()

      cy.wait("@completion").then((interception) => {
        expect(interception.request.body).to.have.property("puzzleId", puzzleId)
        expect(interception.request.body).to.have.property("timeToComplete")
        expect(interception.request.body.timeToComplete).to.be.a("number")
        expect(interception.response.statusCode).to.eq(200)
      })
    })
  })
})
