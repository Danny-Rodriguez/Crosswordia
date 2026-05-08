Cypress.Commands.add("resetDb", () => {
  cy.request("POST", "/__test__/reset")
})

Cypress.Commands.add("testLogin", () => {
  cy.request("POST", "/__test__/login").then((res) => {
    expect(res.status).to.eq(200)
    expect(res.body).to.have.property("id")
  })
})

Cypress.Commands.add("seedPuzzle", (fixtureName) => {
  return cy.fixture(fixtureName).then((puzzle) => {
    return cy.request("POST", "/__test__/seed-puzzle", puzzle).then((res) => {
      expect(res.status).to.eq(200)
      return res.body.id
    })
  })
})
