describe('Books page', () => {
    const collectionsJson = require('../fixtures/collections.json')
    const firstCollections = collectionsJson[0];
  beforeEach(() => {
    cy.intercept('GET', 'http://localhost:3000/users', { fixture: 'users.json' }).as('getUsers');
    cy.intercept('GET', 'http://localhost:3000/collections?type=book', { body: collectionsJson }).as('getColletions');
    cy.intercept('GET', 'http://localhost:3000/collections/1?_embed=books', { body: firstCollections}).as('getFirstCollection');
    cy.intercept('GET', 'http://localhost:3000/collections/2ge2mgc31?_embed=books', { body: collectionsJson[1] }).as('getSecondCollection');
    cy.visit('http://localhost:4200/books/');
  });

  describe('navega a la ruta esperada', () => {
    it('renderiza la página books', () => {
      cy.contains('Book Colletions!');
      cy.url().should('eq', 'http://localhost:4200/books/collection-list');
      cy.contains('Book Colletions!');
      cy.wait(['@getUsers', '@getColletions', '@getFirstCollection', '@getSecondCollection'])/* .then((event) =>  {
        debugger 
      });*/
    });
  });
  
  describe('hacer click en una colección', () => {
    it('expande la colección y muestra los libros que contiene', () => {
      cy.get('[data-test="accordion-tab"]')
        .first()
        .click()
        .find('[data-test="book-table-tr"]').should('have.length', 1);
    });
  });
});
