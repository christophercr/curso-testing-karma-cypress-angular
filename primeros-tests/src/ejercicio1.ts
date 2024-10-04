abstract class Animal {
  distance = 0;

  constructor(private _name: string) {}

  move(meters: number) {
    this.distance += meters;
    console.log(`${this._name} se ha movido ${meters}m.`);
  }
}

class Snake extends Animal {
  constructor(name: string) {
    super(name);
  }

  move(meters = 5): void {
    console.log("Snake deslizándose...");
    super.move(meters);
  }
}

class Pony extends Animal {
  constructor(name: string) {
    super(name);
  }
  move(meters = 60): void {
    console.log("Pony galonpando...");
    super.move(meters);
  }
}

const sammy = new Snake("Sammy la serpiente");
sammy.move();

const pokey = new Pony("Pokey el pony");
pokey.move(34);

sammy.move(15);
pokey.move(8);

console.log(`Posicion final de Sammy: ${sammy.distance}m`);
console.log(`Posicion final de Pokey: ${pokey.distance}m`);
