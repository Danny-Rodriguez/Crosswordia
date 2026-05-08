describe("Dictionary lookup", () => {
  beforeEach(() => {
    cy.resetDb()
    cy.testLogin()
  })

  it("stubs /dictionary and renders synonyms from the response", () => {
    cy.intercept("POST", "/dictionary", { fixture: "dictionary-response.json" }).as("dict")

    cy.visit("/create")
    cy.contains(".sizeButtons button", "5x5").click()
    cy.get("#thesaurus").should("not.have.class", "d-none")

    cy.get("#word").type("glad")
    cy.get("#dictSubmit").click()

    cy.wait("@dict").its("request.body").should("deep.equal", { word: "glad" })

    cy.get("#listDict li").should("have.length", 10)
    cy.get("#listDict li").first().should("have.text", "happy")
  })

  it("handles a /dictionary error gracefully without crashing the page", () => {
    cy.intercept("POST", "/dictionary", { statusCode: 500, body: { error: "boom" } }).as("dictFail")

    cy.visit("/create")
    cy.contains(".sizeButtons button", "5x5").click()
    cy.get("#word").type("nothing")
    cy.get("#dictSubmit").click()
    cy.wait("@dictFail")
    cy.get("body").should("be.visible")
  })
})
