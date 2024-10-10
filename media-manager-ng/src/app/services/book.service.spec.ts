import { TestBed } from '@angular/core/testing';

import { BookService } from './book.service';
import { DeserializationFn, MEDIA_STORAGE_SERVICE, MediaStorageService } from '../models/media-service.model';
import { MediaCollection } from '../models/media-collection.model';
import { Book } from '../models/book.model';
import { Observable, of, zip } from 'rxjs';
import { plainToClassFromExist } from 'class-transformer';
import { toObservable } from '@angular/core/rxjs-interop';

describe('BookService', () => {
  let service: BookService;
  let mediaStorageService: jasmine.SpyObj<MediaStorageService>;

  beforeEach(() => {
    const mediaStorageServiceMock = jasmine.createSpyObj('MediaStorageService', ['getAllItems','getItem']);
    
    TestBed.configureTestingModule({
      providers: [
        {
          provide: MEDIA_STORAGE_SERVICE,
          useValue: mediaStorageServiceMock,
        },
      ]
    });

    service = TestBed.inject(BookService);
    mediaStorageService = TestBed.inject(MEDIA_STORAGE_SERVICE) as jasmine.SpyObj<MediaStorageService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  describe('reloadBookCollections()', () => {
    it('debe recuperar las colecciones y emitirlas en el Observable', (done: DoneFn) => {
      let colecciones:MediaCollection<Book>[] = [
        new MediaCollection(Book, 'book', 'Libro 1', 'abc'),
        new MediaCollection(Book, 'book', 'Libro 2', 'def'),
        new MediaCollection(Book, 'book', 'Libro 3', 'ghi')
      ];

      mediaStorageService.getAllItems.and.returnValue(
        of(colecciones)
      );

      const deserializeCollection = (serializedCollection: any): MediaCollection<Book> => {
        return plainToClassFromExist<MediaCollection<Book>, any>(new MediaCollection<Book>(Book, 'book'), serializedCollection);
      };
      mediaStorageService.getItem.and.callFake((_identifier:string, deserializerFn: Function, mediaType: string) => {
        const coleccionEncontrada = colecciones.find((coleccion) => coleccion.identifier === _identifier);
        expect(coleccionEncontrada).not.toBe(undefined);
        return of(coleccionEncontrada as MediaCollection<any>);
      });

      let contador = 0;
      let collectionsFromSignal$!: Observable<Map<string, MediaCollection<Book>>>;

      TestBed.runInInjectionContext(() => {
        collectionsFromSignal$ = toObservable(service.bookCollectionsSignal);
      });

      /* service.bookCollections$.subscribe({ */
      const collecitonsFromObservable$ = service.bookCollections$;

      zip(collectionsFromSignal$, collecitonsFromObservable$).subscribe({
        next: ([signalCollections, observableCollections]) => {
          expect(signalCollections).toBeDefined();
          expect(observableCollections).toBeDefined();

          contador++;
          if(contador == 1){
            const emittedSignalCollections = Array.from(signalCollections.values());
            expect(emittedSignalCollections).toEqual([]);

            const emittedObservableCollections = Array.from(observableCollections.values());
            expect(emittedObservableCollections).toEqual([]);
            console.log('Contador == 1:', contador);
          }
          if(contador > 1){
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
        }
      });

      service.reloadBookCollections().subscribe();


    })
  })
});
