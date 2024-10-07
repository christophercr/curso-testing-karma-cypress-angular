import { Pony, Snake } from "./ejercicio1";

describe("Curso de Testing", () => {
  describe("Ejercicio 1: sub-clases de animales", () => {
    describe("Una instancia de la clase Snake", () => {
      let sammy: Snake;

      describe("llamando su método move()", () => {
        beforeEach(() => {
          sammy = new Snake("Sammy la serpiente");
        });

        it("debe moverse la distancia que le indico", () => {
          const distance = 15;
          sammy.move(distance);
          expect(sammy.distance).toBe(distance);
        });

        it("debe moverse 5 metros en caso de que no indique la distancia", () => {
          sammy.move();
          expect(sammy.distance).toBe(5);
        });

        it("debe moverse la distancia que le indico aunque sea negativa", () => {
          const distance = 15;
          sammy.move(distance);
          sammy.move(-distance); // debería volver a la posición inicial
          expect(sammy.distance).toBe(0);
        });
      });
    });

    describe("Una instancia de la clase Pony", () => {
      let pokey: Pony;

      describe("llamando su método move()", () => {
        beforeEach(() => {
          pokey = new Pony("Pokey el pony");
        });

        it("debe moverse la distancia que le indico", () => {
          const distance = 34;
          pokey.move(distance);
          expect(pokey.distance).toBe(distance);
        });

        it("debe moverse 60 metros en caso de que no indique la distancia", () => {
          pokey.move();
          expect(pokey.distance).toBe(60);
        });

        it("debe moverse la distancia que le indico aunque sea negativa", () => {
          const distance = 15;
          pokey.move(distance);
          pokey.move(-distance); // debería volver a la posición inicial
          expect(pokey.distance).toBe(0);
        });
      });
    });
  });
});
