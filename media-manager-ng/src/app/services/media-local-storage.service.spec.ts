import { TestBed } from '@angular/core/testing';

import { MediaLocalStorageService } from './media-local-storage.service';
import { MediaCollection } from '../models/media-collection.model';
import { Book } from '../models/book.model';
import localForage from 'localforage';
import { plainToClassFromExist } from 'class-transformer';
import { from, switchMap } from 'rxjs';

describe('MediaLocalStorageService', () => {
  let service: MediaLocalStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MediaLocalStorageService);
  });

  afterEach(() => {
    localForage.dropInstance({ name: 'mediaManager' });
  });

  describe('saveItem', () => {
    it('debe guardar la colección que se le pasa como parámetro', (done: DoneFn) => {
      const collection = new MediaCollection<Book>(Book, 'book', 'Colección 1', '1');

      const localForageCreateInstanceSpy = spyOn(localForage, 'createInstance').and.callThrough();

      service.saveItem(collection, 'book').subscribe({
        next: () => {
          expect(localForageCreateInstanceSpy).toHaveBeenCalledTimes(1);
          const dbInstance = localForageCreateInstanceSpy.calls.all()[0].returnValue;
          // en este caso se puede hacer lo mismo de las siguientes formas:
          //const dbInstance = localForageCreateInstanceSpy.calls.first().returnValue;
          //const dbInstance = localForageCreateInstanceSpy.calls.mostRecent().returnValue;

          dbInstance
            .getItem(collection.identifier)
            .then((value) => {
              expect(value).toBeDefined();
              expect(value).toEqual(
                jasmine.objectContaining({
                  name: collection.name,
                  identifier: collection.identifier,
                  id: collection.id,
                  collection: [],
                  type: collection.type,
                }),
              );
            })
            .catch(() => {
              fail('No debe fallar la el guardado en LocalForage de una colección');
            });
          done();
        },
        error: () => {
          fail('No debe fallar la el guardado de una colección');
        },
      });
    });
  });

  describe('getItem', () => {
    it('debe obtener la colección que ha sido creada con anterioridad', (done: DoneFn) => {
      // primer paso: guardar una colección
      const collection = new MediaCollection<Book>(Book, 'book', 'Colección 1', '1');
      const localForageCreateInstanceSpy = spyOn(localForage, 'createInstance').and.callThrough();

      const deserializationFn = (serializedCollection: any): MediaCollection<Book> => {
        return plainToClassFromExist<MediaCollection<Book>, any>(new MediaCollection<Book>(Book, 'book'), serializedCollection);
      };

      service
        .saveItem(collection, 'book')
        .pipe(
          switchMap(() => {
            return service.getItem(collection.identifier, deserializationFn, 'book');
          }),
        )
        .subscribe({
          next: (retrievedCollection) => {
            expect(retrievedCollection).toBeDefined();
            expect(retrievedCollection).toEqual(
              jasmine.objectContaining({
                name: collection.name,
                identifier: collection.identifier,
                id: collection.id,
                collection: [],
                type: collection.type,
              }),
            );
            done();
          },
          error: () => {
            fail('No debe fallar al obtener una colección ya guardada');
          },
        });
    });
  });

  describe('getAllItems', () => {
    it('debe obtener la colección que ha sido creada con anterioridad', (done: DoneFn) => {
      // primer paso: guardar una colección
      const collection = new MediaCollection<Book>(Book, 'book', 'Colección 1', '1');
      const localForageCreateInstanceSpy = spyOn(localForage, 'createInstance').and.callThrough();

      const deserializationFn = (serializedCollection: any): MediaCollection<Book> => {
        return plainToClassFromExist<MediaCollection<Book>, any>(new MediaCollection<Book>(Book, 'book'), serializedCollection);
      };

      service
        .saveItem(collection, 'book')
        .pipe(
          // segundo paso: recuperar TODAS la colecciones
          switchMap(() => {
            expect(localForageCreateInstanceSpy).toHaveBeenCalledTimes(1);

            return from(service.getAllItems(deserializationFn, 'book'));
          }),
        )
        .subscribe({
          next: (retrievedCollections) => {
            expect(retrievedCollections.length).toBe(1);
            expect(retrievedCollections[0]).toEqual(
              jasmine.objectContaining({
                name: collection.name,
                identifier: collection.identifier,
                id: collection.id,
                collection: [],
                type: collection.type,
              }),
            );

            //localForage.dropInstance({ name: 'mediaManager' /*, storeName: 'media-man-book'*/ });
            done();
          },
          error: (err) => {
            fail('No debe fallar la recuperación de todas las colecciónes');
          },
        });
    });
  });

  describe('deleteItem', () => {
    it('debe obtener la colección que ha sido creada con anterioridad', (done: DoneFn) => {
      // primer paso: guardar una colección
      const collection = new MediaCollection<Book>(Book, 'book', 'Colección 1', '1');
      const localForageCreateInstanceSpy = spyOn(localForage, 'createInstance').and.callThrough();
      let dbInstance: LocalForage;

      service
        .saveItem(collection, 'book')
        .pipe(
          // segundo paso: borrar la colección
          switchMap(() => {
            expect(localForageCreateInstanceSpy).toHaveBeenCalledTimes(1);
            dbInstance = localForageCreateInstanceSpy.calls.all()[0].returnValue;

            return from(service.deleteItem(collection.identifier, 'book'));
          }),
          switchMap(() => {
            // tercer paso: comprobar en la BD que ya no existe la colección
            return from(dbInstance.getItem(collection.identifier));
          }),
        )
        .subscribe({
          next: (retrievedCollection) => {
            expect(retrievedCollection).toBeNull();

            //localForage.dropInstance({ name: 'mediaManager' /*, storeName: 'media-man-book'*/ });
            done();
          },
          error: (err) => {
            fail('No debe fallar la recuperación de una colección');
          },
        });
    });
  });
});
