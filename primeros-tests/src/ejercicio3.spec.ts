import { secondsToHMS } from "./ejercicio3";

describe("Curso de Testing", () => {
  describe("Ejercicio 3: función secondsToHMS()", () => {
    describe("Dada una cantidad de segundos", () => {
      it("debe devolver la cantidad de horas, minutos y segundos", () => {
        const seconds = 3_600;
        const result = secondsToHMS(seconds);
        expect(result).toBe("1 h ");
      });

      it("debe devolver la cantidad de horas, minutos y segundos con 2 dígitos", () => {
        const seconds = 3_600;
        const result = secondsToHMS(seconds, true);
        expect(result).toBe("01 h ");
      });
    });
  });
});
