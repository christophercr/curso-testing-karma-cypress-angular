// ***********************************************
// This example namespace declaration will help
// with Intellisense and code completion in your
// IDE or Text Editor.
// ***********************************************
 declare namespace Cypress {
   interface Chainable<Subject = any> {
    // customCommand(param: any): typeof customCommand;
    assertBookCollectionsUrl(): typeof assertBookCollectionsUrl;
   }
 }
//
// function customCommand(param: any): void {
//   console.warn(param);
// }

function assertBookCollectionsUrl(): void {
    cy.log('verificando que la ruta actual es /collection-list');
    cy.url().should('eq', 'http://localhost:4200/books/collection-list');
    cy.contains('Book Coletions!');
}

//
// NOTE: You can use it like so:
// Cypress.Commands.add('customCommand', customCommand);

Cypress.Commands.add('assertBookCollectionsUrl', assertBookCollectionsUrl);
//
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
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
