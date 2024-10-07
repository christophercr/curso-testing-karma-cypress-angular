import { roundToMinuteRange } from "./ejercicio4";

describe("Curso de Testing", () => {
  describe("Ejercicio 4: función roundToMinuteRange()", () => {
    describe("Dado un timestamp", () => {
      const timestampToTest = new Date(2_024, 9, 10, 10, 40, 15).getTime();

      /*
      FIXME: Estos tests no son entendibles, no se sabe qué se está testando ni qué esperar. Pero... coverage 100%! :S
      it("debería redondear hacia abajo por defecto el tiempo al minuto más cercano", () => {
        expect(roundToMinuteRange(new Date("01/01/23").getTime())).toBe(1_672_527_600_000);
        expect(roundToMinuteRange(new Date("01/01/23").getTime(), false)).toBe(1_672_527_600_000);
      });

      it("debería redondear hacia arriba si se especifica el tiempo al minuto más cercano", () => {
        expect(roundToMinuteRange(new Date("01/01/23").getTime(), true)).toBe(1_672_527_600_000);
      });
      */

      // primera refactorización del test para hacerlo más entendible y saber que estamos testando y sobre todo saber que esperar
      it("debe redondear al minuto siguiente al pasarle el parámetro roundUp a true", () => {
        const expectedDate = new Date(timestampToTest);
        expectedDate.setMinutes(41);
        expectedDate.setSeconds(0);
        expect(roundToMinuteRange(timestampToTest, true)).toBe(expectedDate.getTime());
      });

      it("debe redondear al minuto actual al pasarle el parámetro roundUp a false", () => {
        const expectedDate = new Date(timestampToTest);
        expectedDate.setMinutes(40);
        expectedDate.setSeconds(0);
        expect(roundToMinuteRange(timestampToTest)).toBe(expectedDate.getTime());
      });

      // segunda refactorización del test, mucho más entendible
      it("debe redondear al minuto siguiente al pasarle el parámetro roundUp a true", () => {
        const currentTimestamp = Date.now();
        const nextMinute = roundToMinuteRange(currentTimestamp, true);
        expect(new Date(nextMinute).getMinutes()).toBe(new Date(currentTimestamp).getMinutes() + 1);
      });

      it("debe redondear al minuto actual al pasarle el parámetro roundUp a false", () => {
        const currentTimestamp = Date.now();
        const nextMinute = roundToMinuteRange(currentTimestamp);
        expect(new Date(nextMinute).getMinutes()).toBe(new Date(currentTimestamp).getMinutes());
      });
    });
  });
});
