describe('Books page', () => {
  const collectionsJson = require('../fixtures/collections.json');
  const firstCollection = collectionsJson[0];
  const secondCollection = collectionsJson[1];

  beforeEach(() => {
    cy.intercept('GET', 'http://localhost:3000/users', { fixture: 'users.json' }).as('getUsers');
    cy.intercept('GET', 'http://localhost:3000/collections?type=book', { body: collectionsJson }).as('getColletions');
    cy.intercept('GET', 'http://localhost:3000/collections/1?_embed=books', { body: firstCollection }).as('getFirstCollection');
    cy.intercept('GET', 'http://localhost:3000/collections/2ge2mgc31?_embed=books', { body: secondCollection }).as('getSecondCollection');
    cy.visit('http://localhost:4200/books/');
  });

  describe('navega a la ruta esperada', () => {
    it('renderiza la página books', () => {
      //cy.contains('Book Colletions!');
      //cy.url().should('eq', 'http://localhost:4200/books/collection-list');
      //cy.contains('Book Colletions!');
      cy.assertBookCollectionsUrl();
      cy.wait(['@getUsers', '@getColletions', '@getFirstCollection', '@getSecondCollection'])/* .then((event) =>  {
        debugger 
      });*/
    });
  });

  describe('hacer click en una colección', () => {
    it('expande la colección y muestra los libros que contiene', () => {
      cy.get('[data-test="accordion-tab"]').first().click().find('[data-test="book-table-tr"]').should('have.length', 1);
    });

    it('expande cada colección y muestra los libros que contiene', () => {
      cy.wait('@getUsers');
      cy.wait('@getColletions');

      cy.get('[data-test="accordion-tab"]').should('have.length', 2).as('collectionItems');
      cy.get('@collectionItems').first().as('firstCollection').contains(firstCollection.name).click();

      cy.get('@firstCollection').find('[data-test="book-table-tr"]').should('have.length', firstCollection.books.length);

      cy.get('@collectionItems').last().as('secondCollection').contains(secondCollection.name).click();

      cy.get('@secondCollection').find('[data-test="book-table-tr"]').should('have.length', secondCollection.books.length);
    });
  });

  describe('al hacer click en alguna opción del menú superior', () => {
    it('navega a la pantalla collections-list', () => {
      cy.get('[data-test="link-collections"]').click();
      cy.url().should('eq', 'http://localhost:4200/books/collection-list');
      cy.contains('Book Colletions');
    });


    it('navega a la pantalla new-collection', () => {
      cy.get('[data-test="link-new-collection"]').click();
      cy.url().should('eq', 'http://localhost:4200/books/new-collection');
      cy.contains('New collection');
    });


    it('navega a la pantalla new-book', () => {
      cy.get('[data-test="link-new-book"]').click();
      cy.url().should('eq', 'http://localhost:4200/books/new-book');
      cy.contains('New book');
    });
  });

});
