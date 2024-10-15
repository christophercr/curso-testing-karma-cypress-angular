describe('Home Page spec', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/');
  });

  describe('al hacer click en Books',  () => {
    it('navega a la pantalla BooksPage y cambia automáticamente a la vista del listado de colecciones', () => {
      cy.contains('Media Manager');

      cy.get('[data-test="link-books-page"]').click();

      cy.url().should('eq', 'http://localhost:4200/books/collection-list');
      cy.contains('Book Colletions!');
    });
  });

  describe('al hacer click en Movies', () => {
    it('no navega a ningún sitio porque la pantalla no esta implementada aún', () => {
      cy.contains('Media Manager');

      cy.get('[data-test="link-movies-page"]').click();

      cy.url().should('eq', 'http://localhost:4200/');
      cy.contains('Media Manager');
    });
  });
})