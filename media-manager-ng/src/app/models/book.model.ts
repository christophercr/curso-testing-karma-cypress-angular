import { Expose, Type } from 'class-transformer';
import { Media } from './media.model';
import { Genre } from '../constants/genre.constants';

export class Book extends Media {
  private _author: string;
  private _numberOfPages: number;

  constructor(
    name: string,
    description: string,
    pictureLocation: string,
    genre: Genre,
    author: string,
    numberOfPages: number,
    identifier?: string,
  ) {
    super(name, description, pictureLocation, genre, identifier);
    this._numberOfPages = numberOfPages;
    this._author = author;
  }

  /**
   * Creamos este getter para que la versión serializada del objeto tenga el campo 'id' al igual que esta definido en nuestro API de Json Server
   */
  @Expose()
  get id() {
    return this._identifier;
  }

  @Expose()
  get author(): string {
    return this._author;
  }

  set author(author: string) {
    this._author = author;
  }

  @Expose()
  @Type(() => Number)
  get numberOfPages(): number {
    return this._numberOfPages;
  }

  set numberOfPages(numberOfPages: number) {
    this._numberOfPages = numberOfPages;
  }
}
