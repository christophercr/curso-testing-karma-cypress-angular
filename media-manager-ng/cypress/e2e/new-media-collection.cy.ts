describe.only('New Media Collection spec', () => {
  const collectionsJson = require('../fixtures/collections.json');
  const firstCollections = collectionsJson[0];

  beforeEach(() => {
    cy.intercept('GET', 'http://localhost:3000/users', { fixture: 'users.json' }).as('getUsers');
    cy.intercept('GET', 'http://localhost:3000/collections?type=book', { body: collectionsJson }).as('getColletions');
    cy.intercept('GET', 'http://localhost:3000/collections/1?_embed=books', { body: firstCollections }).as('getFirstCollection');
    cy.intercept('GET', 'http://localhost:3000/collections/2ge2mgc31?_embed=books', { body: collectionsJson[1] }).as('getSecondCollection');
    cy.visit('http://localhost:4200/books/new-collection');
  });

  describe('navega a la ruta esperada', () => {
    it('renderiza la página new-collection', () => {
      cy.url().should('eq', 'http://localhost:4200/books/new-collection');

      cy.contains('New collection');
    });
  });

  describe('el botón Reload Collections', () => {
    it('cambia de color cuando se pasa el mouse sobre él', () => {
      cy.get('[data-test="btn-reload-collections"]')
        .trigger('mouseenter')
        .should('have.css', 'background-color', 'rgb(255, 0, 0)')
        .trigger('mouseleave')
        .should('have.css', 'background-color', 'rgb(100, 149, 237)');
    });
  });
});
