import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewBookComponent } from './new-book.component';
import { BookService } from '../../services/book.service';
import { signal } from '@angular/core';
import { MediaCollection } from '../../models/media-collection.model';
import { Book } from '../../models/book.model';
import { Genre } from '../../constants/genre.constants';
import { FormControl } from '@angular/forms';
import { By } from '@angular/platform-browser';

describe('NewBookComponent', () => {
  let component: NewBookComponent;
  let fixture: ComponentFixture<NewBookComponent>;
  let bookService: jasmine.SpyObj<BookService>;
  const bookCollectionsSignalStub = signal<Map<string, MediaCollection<Book>>>(new Map());

  beforeEach(async () => {
    const dummyCollections = new Map<string, MediaCollection<Book>>([
      ['1', new MediaCollection(Book, 'book', 'Primera colección', '1')],
      ['2', new MediaCollection(Book, 'book', 'Segunda colección', '2')],
    ]);
    bookCollectionsSignalStub.set(dummyCollections);
    const bookServiceMock = jasmine.createSpyObj('BookService', ['createBook'], {
      bookCollectionsSignal: bookCollectionsSignalStub,
    });

    await TestBed.configureTestingModule({
      imports: [NewBookComponent],
      providers: [
        {
          provide: BookService,
          useValue: bookServiceMock,
        },
      ],
    }).compileComponents();

    bookService = TestBed.inject(BookService) as jasmine.SpyObj<BookService>;
    fixture = TestBed.createComponent(NewBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('outputs:', () => {
    describe('create', () => {
      it('probar que emite tras la creación del libro', (done: DoneFn) => {
        const spy = spyOn(component.created, 'emit');
        const book = new Book('A', 'B', 'C', Genre.Fantastic, 'D', 0, '1');

        const compiledHtml = fixture.nativeElement as HTMLElement;
        const button = compiledHtml.querySelector('[data-test="btn-create-book"]') as HTMLButtonElement;

        bookService.createBook.and.returnValue(
          new Promise((resolve, reject) => {
            setTimeout(() => {
              resolve();
            }, 1000);
          }),
        );

        const book2 = new Book('carasui', 'el gato más querido de Laura', 'C:gatosbonitos', Genre.Horror, 'Laura', 1000, '1');

        const controlsInForm = component.myForm.controls;

        for (const key in controlsInForm) {
          const control = (controlsInForm as Record<string, FormControl>)[key];
          expect(control).toBeDefined();
          control.setValue(book2[key as keyof Book]);
        }
        component.myForm.controls.collection.setValue('1');

        // fixture.componentInstance.myForm.setValue(control|json);
        


        bookService.createBook('1', book).then(() => {
          setTimeout(() => {
            expect(spy).toHaveBeenCalledTimes(1);
            expect(spy).toHaveBeenCalledWith(jasmine.objectContaining<Book>({
              name: book2.name,
              author: book2.author,
              description: book2.description,
              pictureLocation: book2.pictureLocation,
              genre: book2.genre,
              numberOfPages: book2.numberOfPages,
            }),);
            done();
          }, 50);
        });

        button.click();

        fixture.detectChanges();
      });
      it('V2 -debe emitir el nuevo Book cuando el botón "Create" es clickado', (done: DoneFn) => {
        const buttonDebugElement = fixture.debugElement.query(By.css('[data-test="btn-create-book"]'));
        bookService.createBook.and.returnValue(Promise.resolve());

        const dummyBook = new Book('Mi libro favorito', 'Un libro que hay que leer', 'picture', Genre.Fantastic, 'Un buen autor', 412);
        const controlsInForm = component.myForm.controls;

        for (const key in controlsInForm) {
          const control = (controlsInForm as Record<string, FormControl>)[key];
          expect(control).toBeDefined();
          control.setValue(dummyBook[key as keyof Book]);
        }
        component.myForm.controls.collection.setValue('1');

        component.created.subscribe({
          next: (book: Book) => {
            expect(book).toEqual(jasmine.objectContaining<Book>({
              name: dummyBook.name,
              author: dummyBook.author,
              description: dummyBook.description,
              pictureLocation: dummyBook.pictureLocation,
              genre: dummyBook.genre,
              numberOfPages: dummyBook.numberOfPages,
            }));
            done();
          },
          error: () => {
            fail('El emitter no debe dar error');
          }
        });

        (buttonDebugElement.nativeElement as HTMLButtonElement).click();
      });
    });
  });

  describe('select de colecciones', () => {
    it('debe mostrar por defecto la primera colección seleccionada', () => {
      const collections = bookCollectionsSignalStub();
      const firstCollection = collections.values().next().value as MediaCollection<Book>;
      expect(component.myForm.controls.collection.value).toBeDefined();
      expect(component.myForm.controls.collection.value).toBe(firstCollection.identifier);

      const compiledHtml = fixture.nativeElement as HTMLElement;
      const selectCollections = compiledHtml.querySelector('[data-test="select-collections"]') as HTMLSelectElement;
      expect(selectCollections.value).toBe(firstCollection.identifier);
    });
  });

  describe('select de géneros', () => {
    it('debe mostrar el listado de los géneros posibles a elegir', () => {
      const genresArray: (keyof typeof Genre)[] = [];

      // crear array a partir del enum
      for (const key in Genre) {
        genresArray.push(Genre[key as keyof typeof Genre]);
      }

      const compiledHtml = fixture.nativeElement as HTMLElement;
      const genreOptions = compiledHtml.querySelectorAll<HTMLOptionElement>('[data-test="select-genres"] option');
      expect(genreOptions.length).toBe(genresArray.length);

      genreOptions.forEach((option, index) => {
        expect(option.value).toBe(genresArray[index]);
      });
    });
  });
});
