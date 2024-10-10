import { TestBed } from '@angular/core/testing';

import { BookService } from './book.service';
import { DeserializationFn, MEDIA_STORAGE_SERVICE, MediaStorageService } from '../models/media-service.model';
import { MediaCollection } from '../models/media-collection.model';
import { Book } from '../models/book.model';
import { Observable, of, zip } from 'rxjs';
import { plainToClassFromExist } from 'class-transformer';
import { toObservable } from '@angular/core/rxjs-interop';
import { Genre } from '../constants/genre.constants';

describe('BookService', () => {
  let service: BookService;
  let mediaStorageService: jasmine.SpyObj<MediaStorageService>;

  beforeEach(() => {
    const mediaStorageServiceMock = jasmine.createSpyObj('MediaStorageService', ['getAllItems', 'getItem', 'saveItem', 'deleteItem']);

    TestBed.configureTestingModule({
      providers: [
        {
          provide: MEDIA_STORAGE_SERVICE,
          useValue: mediaStorageServiceMock,
        },
      ],
    });

    service = TestBed.inject(BookService);
    mediaStorageService = TestBed.inject(MEDIA_STORAGE_SERVICE) as jasmine.SpyObj<MediaStorageService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  describe('reloadBookCollections()', () => {
    it('debe recuperar las colecciones y emitirlas en el Observable', (done: DoneFn) => {
      let colecciones: MediaCollection<Book>[] = [
        new MediaCollection(Book, 'book', 'Libro 1', 'abc'),
        new MediaCollection(Book, 'book', 'Libro 2', 'def'),
        new MediaCollection(Book, 'book', 'Libro 3', 'ghi'),
      ];

      mediaStorageService.getAllItems.and.returnValue(of(colecciones));

      const deserializeCollection = (serializedCollection: any): MediaCollection<Book> => {
        return plainToClassFromExist<MediaCollection<Book>, any>(new MediaCollection<Book>(Book, 'book'), serializedCollection);
      };
      mediaStorageService.getItem.and.callFake((_identifier: string, deserializerFn: Function, mediaType: string) => {
        const coleccionEncontrada = colecciones.find((coleccion) => coleccion.identifier === _identifier);
        expect(coleccionEncontrada).not.toBe(undefined);
        return of(coleccionEncontrada as MediaCollection<any>);
      });

      let contador = 0;
      let collectionsFromSignal$!: Observable<Map<string, MediaCollection<Book>>>;

      TestBed.runInInjectionContext(() => {
        collectionsFromSignal$ = toObservable(service.bookCollectionsSignal); // convertimos la signal a observable para simplificar un poco la lógica del test usando RxJS
      });

      /* service.bookCollections$.subscribe({ */
      const collecitonsFromObservable$ = service.bookCollections$;

      // aquí queremos validar que tanto la signal como el observable emiten exactamente las mismas colecciones
      // para ello usamos el operador zip() para obtener las emisiones de cada observable en orden y "pareadas" (emision 1 del observable y emision 1 de signal, y así sucesivamente)
      zip(collectionsFromSignal$, collecitonsFromObservable$).subscribe({
        next: ([signalCollections, observableCollections]) => {
          expect(signalCollections).toBeDefined();
          expect(observableCollections).toBeDefined();

          contador++;
          if (contador == 1) {
            const emittedSignalCollections = Array.from(signalCollections.values());
            expect(emittedSignalCollections).toEqual([]); // porque es el valor por defecto con que se inicializa el BehaviourSubject

            const emittedObservableCollections = Array.from(observableCollections.values());
            expect(emittedObservableCollections).toEqual([]); // porque es el valor por defecto con que se inicializa el BehaviourSubject
            console.log('Contador == 1:', contador);
          }
          if (contador > 1) {
            const emittedSignalollections = Array.from(signalCollections.values());
            expect(emittedSignalollections).toEqual(colecciones);

            const emittedObservableCollections = Array.from(observableCollections.values());
            expect(emittedObservableCollections).toEqual(colecciones);
            console.log('Contador > 1:', contador);
            done();
          }
        },
        error: () => {
          fail('El emitter no debe dar error');
        },
      });

      service.reloadBookCollections().subscribe();
    });
  });

  describe('createBookCollection()', () => {
    it('debe de guardar la colección en el MediaStorageService', (done: DoneFn) => {
      const collectionName = 'Colección 1';

      mediaStorageService.saveItem.and.returnValue(of('nothing' as any)); // el metodo saveItem no devuelve nada

      service.createBookCollection(collectionName).then(() => {
        expect(mediaStorageService.saveItem).toHaveBeenCalledTimes(1);
        expect(mediaStorageService.saveItem).toHaveBeenCalledWith(
          jasmine.objectContaining<MediaCollection<Book>>({
            collection: [],
            name: collectionName,
            type: 'book',
          }),
          'book',
          'create-collection',
          undefined,
          undefined,
        );
        done();
      });
    });
  });

  describe('removeBookCollection()', () => {
    it('debe de eliminar la colección en el MediaStorageService', (done: DoneFn) => {
      mediaStorageService.deleteItem.and.returnValue(of('nothing' as any)); // el metodo deleteItem no devuelve nada

      expect(mediaStorageService.deleteItem).toHaveBeenCalledTimes(0);

      service.removeBookCollection('1');

      // debido a que el removeBookCollection() no devuelve nada, sólo podemos poner un setTimeout para hacer nuestras validaciones pasados unos milisegundos :S
      // en este caso, lo ideal sería que el removeBookCollection() devolviera un Observable (tanto para mejor testabilidad pero incluso para mejor usabilidad para el desarrollador)
      setTimeout(() => {
        expect(mediaStorageService.deleteItem).toHaveBeenCalledTimes(1);
        expect(mediaStorageService.deleteItem).toHaveBeenCalledWith('1', 'book');
        done();
      }, 10);
    });
  });

  describe('createBook()', () => {
    it('debe de guardar el libro en el MediaStorageService', (done: DoneFn) => {
      // primer paso: guardar una nueva colección
      const collectionName = 'Colección 1';
      let collectionId: string;
      const bookToCreate = new Book('Mi libro favorito', 'Un libro que hay que leer', 'picture', Genre.Fantastic, 'Un buen autor', 412);

      mediaStorageService.saveItem.and.returnValue(of('nothing' as any)); // el metodo saveItem no devuelve nada

      service
        .createBookCollection(collectionName)
        .then((idCollectionCreated) => {
          collectionId = idCollectionCreated;

          expect(mediaStorageService.saveItem).toHaveBeenCalledTimes(1);
          expect(mediaStorageService.saveItem).toHaveBeenCalledWith(
            jasmine.objectContaining<MediaCollection<Book>>({
              collection: [],
              name: collectionName,
              type: 'book',
            }),
            'book',
            'create-collection',
            undefined,
            undefined,
          );
          mediaStorageService.saveItem.calls.reset();

          // segundo paso: guardar un nuevo libro
          return service.createBook(collectionId, bookToCreate);
        })
        .then(() => {
          expect(mediaStorageService.saveItem).toHaveBeenCalledTimes(1);
          expect(mediaStorageService.saveItem).toHaveBeenCalledWith(
            jasmine.objectContaining<MediaCollection<Book>>({
              id: collectionId,
              name: collectionName,
              type: 'book',
              collection: [bookToCreate],
            }),
            'book',
            'create-collection-item',
            bookToCreate,
            collectionId,
          );
          done();
        });
    });
  });

  describe('removeBook()', () => {
    it('debe de borrar el libro en el MediaStorageService', (done: DoneFn) => {
      // primer paso: guardar una nueva colección
      const collectionName = 'Colección 1';
      let collectionId: string;
      const bookToCreate = new Book('Mi libro favorito', 'Un libro que hay que leer', 'picture', Genre.Fantastic, 'Un buen autor', 412);

      mediaStorageService.saveItem.and.returnValue(of('nothing' as any)); // el metodo saveItem no devuelve nada

      service
        .createBookCollection(collectionName)
        .then((idCollectionCreated) => {
          collectionId = idCollectionCreated;

          expect(mediaStorageService.saveItem).toHaveBeenCalledTimes(1);
          expect(mediaStorageService.saveItem).toHaveBeenCalledWith(
            jasmine.objectContaining<MediaCollection<Book>>({
              collection: [],
              name: collectionName,
              type: 'book',
            }),
            'book',
            'create-collection',
            undefined,
            undefined,
          );
          mediaStorageService.saveItem.calls.reset();

          // segundo paso: guardar un nuevo libro
          return service.createBook(collectionId, bookToCreate);
        })
        .then(() => {
          expect(mediaStorageService.saveItem).toHaveBeenCalledTimes(1);
          expect(mediaStorageService.saveItem).toHaveBeenCalledWith(
            jasmine.objectContaining<MediaCollection<Book>>({
              id: collectionId,
              name: collectionName,
              type: 'book',
              collection: [bookToCreate],
            }),
            'book',
            'create-collection-item',
            bookToCreate,
            collectionId,
          );

          mediaStorageService.saveItem.calls.reset();
          // tercer paso: borrar el nuevo libro
          return service.removeBook(collectionId, bookToCreate.identifier);
        })
        .then(() => {
          expect(mediaStorageService.saveItem).toHaveBeenCalledTimes(1);
          expect(mediaStorageService.saveItem).toHaveBeenCalledWith(
            jasmine.objectContaining<MediaCollection<Book>>({
              id: collectionId,
              name: collectionName,
              type: 'book',
              collection: [],
            }),
            'book',
            'remove-collection-item',
            bookToCreate.identifier,
            undefined,
          );
          done();
        });
    });
  });
});
