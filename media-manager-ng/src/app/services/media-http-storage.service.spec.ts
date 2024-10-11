import { TestBed } from '@angular/core/testing';

import { MediaHttpStorageService } from './media-http-storage.service';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { MediaCollection } from '../models/media-collection.model';
import { Book } from '../models/book.model';
import { environment } from '../../environments/environment';
import { instanceToPlain, plainToClassFromExist } from 'class-transformer';
import { Genre } from '../constants/genre.constants';

fdescribe('MediaHttpStorageService', () => {
  let service: MediaHttpStorageService;
  const httpClientMock = jasmine.createSpyObj('HttpClient', ['post', 'delete', 'get']);
  let httpService: jasmine.SpyObj<HttpClient>;
  const apiUrl = environment.booksApiUrl;

  beforeEach(() => {
    //const httpClientMock = jasmine.createSpyObj('HttpClient', ['post', 'delete', 'get']);
    TestBed.configureTestingModule({
      providers: [
        {
          provide: HttpClient,
          useValue: httpClientMock,
        },
      ],
    });
    httpService = TestBed.inject(HttpClient) as jasmine.SpyObj<HttpClient>;
    service = TestBed.inject(MediaHttpStorageService);
    //httpService.post.calls.reset();
  });

  afterEach(() => {
    httpService.post.calls.reset();
  });

  describe('saveItem', () => {
    describe('create collection', () => {
      it('debe hacer la llamada Http para guardar la colección que se le pasa como parámetro', (done: DoneFn) => {
        const collection = new MediaCollection<Book>(Book, 'book', 'Colección 1', '1');
        httpService.post.and.returnValue(of('post SUCCESS'));

        const serializedVersion = instanceToPlain(collection, { excludePrefixes: ['_'] });

        service.saveItem(collection, 'book', 'create-collection').subscribe({
          next: () => {
            expect(httpService.post).toHaveBeenCalledTimes(1);
            expect(httpService.post).toHaveBeenCalledWith(`${apiUrl}collections`, serializedVersion);
            done();
          },
          error: () => {
            fail('No debe fallar el guardado de una colección');
          },
        });
      });
    });

    describe('create collection item', () => {
      it('debe hacer la llamada Http para guardar el libro en la colección que se le pasa como parámetro', (done: DoneFn) => {
        const collection = new MediaCollection<Book>(Book, 'book', 'Colección 1', '1');
        const book = new Book('Un libro', 'Buena lectura', 'imagen del libro', Genre.Fantastic, 'un autor', 231, '1');
        const serializedVersion = instanceToPlain(book, { excludePrefixes: ['_'] });
        serializedVersion['collectionId'] = collection.identifier;
        httpService.post.and.returnValue(of('post SUCCESS'));

        service.saveItem(collection, 'book', 'create-collection-item', book, collection.identifier).subscribe({
          next: () => {
            expect(httpService.post).toHaveBeenCalledTimes(1);
            expect(httpService.post).toHaveBeenCalledWith(`${apiUrl}books`, serializedVersion);
            done();
          },
          error: () => {
            fail('No debe fallar el guardado de una colección');
          },
        });
      });
    });

    describe('remove collection item', () => {
      it('debe hacer la llamada Http para guardar el libro en la colección que se le pasa como parámetro', (done: DoneFn) => {
        const collection = new MediaCollection<Book>(Book, 'book', 'Colección 1', '1');
        const book = new Book('Un libro', 'Buena lectura', 'imagen del libro', Genre.Fantastic, 'un autor', 231, '1');
        httpService.delete.and.returnValue(of('delete SUCCESS'));

        service.saveItem(collection, 'book', 'remove-collection-item', book.identifier).subscribe({
          next: () => {
            expect(httpService.delete).toHaveBeenCalledTimes(1);
            expect(httpService.delete).toHaveBeenCalledWith(`${apiUrl}books/${book.identifier}`);
            done();
          },
          error: () => {
            fail('No debe fallar el guardado de una colección');
          },
        });
      });
    });
  });

  describe('getItem', () => {
    const deserializeCollection = (serializedCollection: any): MediaCollection<Book> => {
      return plainToClassFromExist<MediaCollection<Book>, any>(new MediaCollection<Book>(Book, 'book'), serializedCollection);
    };

      it('Debemos recuperar una colección de libros', (done : DoneFn) =>{
      const collectionObj =  {
          "id": "1",
          "name": "Mis libros",
          "type": "book",
          "books": [
            {
              "id": "1",
              "name": "Angular",
              "description": "Un libro sobre Angular",
              "pictureLocation": "https://angular.io/assets/images/logos/angular/angular.png",
              "genre": "Romance",
              "author": "John Doe",
              "numberOfPages": 154,
              "collectionId": "1"
            }
          ]
        };
        httpService.get.and.returnValue(of(collectionObj));

        service.getItem('1', deserializeCollection,'book').subscribe({
        
          next: (collection) => {
            let libroDummy = new Book("Angular", "Un libro sobre Angular", "https://angular.io/assets/images/logos/angular/angular.png", Genre.Romance, "John Doe", 154, '1');
            let coleccionDummy = new MediaCollection<Book>(Book, collectionObj.type, collectionObj.name, collectionObj.id);
            coleccionDummy.addMedia(libroDummy);
            expect(httpService.get).toHaveBeenCalledTimes(1);
            expect(httpService.get).toHaveBeenCalledWith(`${apiUrl}collections/1?_embed=books`);

            expect(collection).toEqual(coleccionDummy);

            done();
          },
          error: () => {
            fail('No debe fallar recuperar una colección');
          },
        });

      });
  });
});
