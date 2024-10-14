import { FormatTextPipe } from './format-text.pipe';

describe('FormatTextPipe', () => {
  let pipe: FormatTextPipe;

  beforeEach(() => {
    pipe = new FormatTextPipe();
  });

  describe('transform', () => {
    const text = 'un texto de prueba';

    describe('formato "title-case"', () => {
      it('debe transformar el texto de entrada a Title Case', () => {
        const formattedText = pipe.transform(text, 'title-case');
        expect(formattedText).toBe('Un Texto De Prueba');
      });

      it('no debe transformar el texto si ya está en Title Case', () => {
        const expectedTest = 'Un Texto De Prueba';
        const formattedText = pipe.transform(expectedTest, 'title-case');
        expect(formattedText).toBe(expectedTest);
      });

      it('no debe transformar el texto si son digitos numéricos', () => {
        const expectedTest = '12345';
        const formattedText = pipe.transform(expectedTest, 'title-case');
        expect(formattedText).toBe(expectedTest);
      });
    });

    describe('formato "upper-first"', () => {
      it('debe de transformar el texto de entrada poniendo la primera letra en mayúscula', () => {
        const formattedText = pipe.transform(text, 'upper-first');
        expect(formattedText).toBe('Un texto de prueba');
      });

      it('no debe transformar el texto si ya está tiene la primera letra en mayúscula', () => {
        const expectedTest = 'Un texto de prueba';
        const formattedText = pipe.transform(expectedTest, 'upper-first');
        expect(formattedText).toBe(expectedTest);
      });

      it('no debe transformar el texto si son digitos numéricos', () => {
        const expectedTest = '12345';
        const formattedText = pipe.transform(expectedTest, 'title-case');
        expect(formattedText).toBe(expectedTest);
      });
    });

    describe('formato "lower-first"', () => {
      const upperCaseText = 'UN TEXTO DE PRUEBA';

      it('debe de transformar el texto de entrada poniendo la primera letra en minúscula', () => {
        const formattedText = pipe.transform(upperCaseText, 'lower-first');
        expect(formattedText).toBe('uN TEXTO DE PRUEBA');
      });

      it('no debe transformar el texto si ya está tiene la primera letra en minúscula', () => {
        const expectedTest = 'uN TEXTO de prueba';
        const formattedText = pipe.transform(expectedTest, 'lower-first');
        expect(formattedText).toBe(expectedTest);
      });

      it('no debe transformar el texto si son digitos numéricos', () => {
        const expectedTest = '12345';
        const formattedText = pipe.transform(expectedTest, 'title-case');
        expect(formattedText).toBe(expectedTest);
      });
    });
  });
});
