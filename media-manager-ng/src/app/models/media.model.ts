import { Expose } from 'class-transformer';
import { Genre } from '../constants/genre.constants';

export abstract class Media {
  protected _identifier: string; // debe ser protected para que las clases hijas puedan acceder a ella!

  protected constructor(
    private _name: string,
    private _description: string,
    private _pictureLocation: string,
    private _genre: Genre,
    identifier?: string,
  ) {
    if (identifier) {
      this._identifier = identifier;
    } else {
      // esto solo es un ejemplo, en un proyecto real es mejor utilizar UUIDs
      // https://www.npmjs.com/package/uuid
      this._identifier = Math.random().toString(36).substr(2, 9);
    }
  }

  @Expose()
  get identifier(): string {
    return this._identifier;
  }

  set identifier(identifier: string) {
    this._identifier = identifier;
  }

  @Expose()
  get name(): string {
    return this._name;
  }

  set name(name: string) {
    this._name = name;
  }

  @Expose()
  get description(): string {
    return this._description;
  }

  set description(description: string) {
    this._description = description;
  }

  @Expose()
  get pictureLocation(): string {
    return this._pictureLocation;
  }

  set pictureLocation(pictureLocation: string) {
    this._pictureLocation = pictureLocation;
  }

  @Expose()
  get genre() {
    return this._genre;
  }

  set genre(genre: Genre) {
    this._genre = genre;
  }
}
