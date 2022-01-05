// ***********************************************
// This example commands.js shows you how to
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
import '@testing-library/cypress/add-commands';

Cypress.Commands.add('assertLoggedIn', () => {
	cy.window().its('localStorage.nuber-authTokenVar').should('be.a', 'string');
});

Cypress.Commands.add('login', (email, password) => {
	cy.visit('/');
	cy.findByPlaceholderText(/email/i).type(email);
	cy.findByPlaceholderText(/password/i).type(password);
	cy.findByRole('button').should('not.have.class', 'bg-gray-300 pointer-events-none').click();
	cy.window().its('localStorage.nuber-authTokenVar').should('be.a', 'string');
});

Cypress.Commands.add('assertTitle', (title) => {
	cy.title().should('eq', title);
});
