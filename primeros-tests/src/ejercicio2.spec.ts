import { removeDuplicatesByKey } from "./ejercicio2";

describe("Curso de Testing", () => {
  describe("Ejercicio 2: función removeDuplicatesByKey()", () => {
    describe("Dado un array existente de objetos con una clave", () => {
      it("debe devolver un array con los elementos que no existen en el array original", () => {
        const existingArray = [
          { id: 1, name: "primero" },
          { id: 3, name: "tercero" },
          { id: 5, name: "quinto" },
        ];
        const secondArray = [
          { id: 1, name: "primero" },
          { id: 2, name: "segundo" },
          { id: 3, name: "tercero" },
          { id: 4, name: "cuarto" },
          { id: 5, name: "quinto" },
        ];

        const uniqueArray = removeDuplicatesByKey(secondArray, existingArray, "id");
        expect(uniqueArray.length).toBe(2);
        expect(uniqueArray.map((item) => item.id)).toEqual([2, 4]);
      });
    });

    describe("Dado un array existente vacío", () => {
      it("debe devolver TODOS los elementos del nuevo array", () => {
        const existingArray: { id: number }[] = [];
        const secondArray = [
          { id: 1, name: "primero" },
          { id: 2, name: "segundo" },
          { id: 3, name: "tercero" },
          { id: 4, name: "cuarto" },
          { id: 5, name: "quinto" },
        ];

        const uniqueArray = removeDuplicatesByKey(secondArray, existingArray, "id");
        expect(uniqueArray.length).toBe(secondArray.length);
        expect(uniqueArray.map((item) => item.id)).toEqual(secondArray.map((item) => item.id));
      });
    });

    describe("Dado un array existente con elementos y un array nuevo vacío", () => {
      it("debe devolver un array vacío", () => {
        const existingArray = [
          { id: 1, name: "primero" },
          { id: 2, name: "segundo" },
          { id: 3, name: "tercero" },
          { id: 4, name: "cuarto" },
          { id: 5, name: "quinto" },
        ];
        const secondArray: { id: number }[] = [];

        const uniqueArray = removeDuplicatesByKey(secondArray, existingArray, "id");
        expect(uniqueArray.length).toBe(0);
      });
    });
  });
});
