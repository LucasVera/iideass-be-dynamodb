/// <reference types="cypress" />

import baseIdeaMock from "./mocks/baseIdeaMock"

// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }
const baseUrl = Cypress.env('CYPRESS_API_URL')
Cypress.Commands.add('assertIdeaDoesntExist', () => {
  const { email, subject } = baseIdeaMock
  // const baseUrl = Cypress.env('CYPRESS_API_URL')
  const url = `${baseUrl}/idea?email=${email}&subject=${subject}`
  cy.request(url).then((result) => {
    const {
      isOkStatusCode,
      body
    } = result

    expect(isOkStatusCode).to.be.true

    expect(body).to.have.property('success', true)
    expect(body).to.have.property('data')
    expect(body.data).to.have.property('idea', null)
  })
})

Cypress.Commands.add('assertIdeaExists', () => {
  const { email, subject } = baseIdeaMock
  // const baseUrl = 'http://localhost:3000/dev'
  const url = `${baseUrl}/idea?email=${email}&subject=${subject}`
  cy.request(url).then((result) => {
    const {
      isOkStatusCode,
      body
    } = result

    expect(isOkStatusCode).to.be.true

    expect(body).to.have.property('success', true)
    expect(body).to.have.property('data')
    expect(body.data).to.have.property('idea')
    expect(body.data.idea).not.to.be.null
  })
})

Cypress.Commands.add('deleteIdea', () => {
  const { email, subject } = baseIdeaMock
  // const baseUrl = 'http://localhost:3000/dev'
  const url = `${baseUrl}/idea?email=${email}&subject=${subject}`
  cy.request({
    method: 'DELETE',
    failOnStatusCode: false,
    url,
  }).then((result) => {
    const {
      isOkStatusCode,
      body,
      status
    } = result

    if (status === 404) {
      // not found means it's already deleted.
      // no need to assert anything else
      expect(true)
      return
    }

    expect(isOkStatusCode).to.be.true

    expect(body).to.have.property('success', true)
    expect(body).to.have.property('data')
    expect(body.data).to.have.property('deletedIdea')
    expect(body.data.deletedIdea).not.to.be.null
  })
})
