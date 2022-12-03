/// <reference types="cypress" />

import createIdeaMock from "../support/mocks/createIdeaMock"

const apiBaseUrl = Cypress.env('CYPRESS_API_URL')

describe('POST /idea', () => {
  afterEach(() => {
    cy.deleteIdea()
  })

  it("creates a new idea", () => {
    const url = `${apiBaseUrl}/idea`
    const createIdeaBody = createIdeaMock
    cy.request('POST', url, createIdeaBody).then(() => {
      cy.assertIdeaExists()
    })
  })

  it('create idea fails on empty body', () => {
    const url = `${apiBaseUrl}/idea`
    cy.request({
      method: 'POST',
      url,
      failOnStatusCode: false
    }).then((result) => {
      const {
        body,
        isOkStatusCode,
        status
      } = result

      expect(isOkStatusCode).not.to.be.true
      expect(status).to.equal(400)
      expect(body).to.have.property('message', 'Invalid request body')
    })
  })

  it('create idea fails on empty email', () => {
    const url = `${apiBaseUrl}/idea`
    const createIdeaBody = createIdeaMock
    delete createIdeaBody.email
    cy.request({
      method: 'POST',
      url,
      failOnStatusCode: false,
      body: createIdeaBody,
    }).then((result) => {
      const {
        body,
        isOkStatusCode,
        status
      } = result

      expect(isOkStatusCode).not.to.be.true
      expect(status).to.equal(400)
      expect(body).to.have.property('success', false)
      expect(body).to.have.property('error', 'Email is required.')
    })
  })
})
