describe('New Media Collection spec', () => {
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

    it('limpia el valor del campo campo de texto', () => {
      cy.get('[data-test="field-collection-name"]').as('fieldCollectionName').type('nueva colección');
      cy.get('[data-test="btn-reload-collections"]').click();
      cy.get('@fieldCollectionName').should('have.value', '');
    });
  });

  describe('el botón Create', () => {
    it('se habilita sólo cuando el valor del campo de texto es válido (longitud mínima de 4 y no contiene caracteres inválidos)', () => {
      cy.get('[data-test="button-create"]')
        // .should('have.attr','disabled')
        .should('be.disabled');
      cy.get('[data-test="field-collection-name"]').type('hola');
      cy.get('[data-test="button-create"]').should('be.enabled');
      // borra el último caracter introducido
      //cy.get('[data-test="field-collection-name"]').type('{del}')
      cy.get('[data-test="field-collection-name"]').clear().type('hol');
      cy.get('[data-test="button-create"]').should('be.disabled');
      //cy.get('[data-test="field-collection-name"]').clear().type('*');
      //cy.get('[data-test="button-create"]').should('be.disabled');
      // para probar todos los caracteres erróneos
      ['-', '*', '.', ','].forEach((char) => {
        cy.get('[data-test="field-collection-name"]').clear().type(`nueva${char}colección`);
        cy.get('[data-test="button-create"]').should('be.disabled');
      });
    });

    it('hace petición POST para guardar la colección y posteriormente navega al listado de colecciones', () => {
      const postStub = cy.stub().as('postCollection');

      cy.intercept('POST', 'http://localhost:3000/collections', (req) => {
        postStub(req);
        req.reply({ statusCode: 200 });
      });

      cy.get('[data-test="field-collection-name"]').type('nueva colección');
      cy.get('[data-test="button-create"]').should('be.enabled').click();

      cy.get('@postCollection').its('callCount').should('eq', 1);
      cy.get('@postCollection').should('have.callCount', 1);
      cy.get('@postCollection')
        .should('have.been.calledOnce')
        .should('have.been.calledWithMatch', {
          body: {
            name: 'nueva colección',
            type: 'book',
          },
        });

        cy.assertBookCollectionsUrl();
      //cy.url().should('eq', 'http://localhost:4200/books/collection-list');
      //cy.contains('Book Colletions!');
    });
  });
});
