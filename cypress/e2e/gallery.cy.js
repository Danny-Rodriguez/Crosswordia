describe("Gallery (guest)", () => {
  it("renders the gallery page for an unauthenticated visitor", () => {
    cy.visit("/gallery")
    cy.contains("h1", "Crossword Gallery")
    cy.contains("button", "Beginner")
    cy.contains("button", "Intermediate")
    cy.contains("button", "Advanced")
    cy.get("a[href^='/solve/']").should("have.length.greaterThan", 0)
  })

  it("redirects unauthenticated users to /gallery when they hit a protected route", () => {
    cy.request({ url: "/", followRedirect: false }).then((res) => {
      expect(res.status).to.eq(302)
      expect(res.redirectedToUrl).to.match(/\/gallery$/)
    })
  })
})
