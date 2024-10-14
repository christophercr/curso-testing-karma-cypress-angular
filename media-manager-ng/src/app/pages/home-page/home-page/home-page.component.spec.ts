import { TestBed } from '@angular/core/testing';

import { HomePageComponent } from './home-page.component';
import { appConfig } from '../../../app.config';
import { RouterTestingHarness } from '@angular/router/testing';
import { Router } from '@angular/router';
import { BooksPageComponent } from '../../books-page/books-page.component';
import { UserType, type User } from '../../../models/user.model';
import { AuthenticationService } from '../../../services/authentication.service';
import { BookService } from '../../../services/book.service';
import { of } from 'rxjs';
import type { MediaCollection } from '../../../models/media-collection.model';
import type { Book } from '../../../models/book.model';

describe('HomePageComponent', () => {
  let component: HomePageComponent;
  let harness: RouterTestingHarness;
  let router: Router;
  let authenticationService: jasmine.SpyObj<AuthenticationService>;
  let bookService: jasmine.SpyObj<BookService>;

  beforeEach(async () => {
    const authenticationServiceMock = jasmine.createSpyObj('AuthenticationService', [], {
      currentUser: {
        id: '1',
        username: 'dummy user',
        password: '1234',
        userType: UserType.Admin,
      } as User,
    });
    const bookServiceMock = jasmine.createSpyObj('BookService', ['reloadBookCollections'], {
      bookCollections$: of(new Map<string, MediaCollection<Book>>()),
    });

    await TestBed.configureTestingModule({
      ...appConfig,
      imports: [HomePageComponent],
      providers: [
        ...appConfig.providers, // cogemos los providers que ya teníamos para no perderlos! (router + definición de rutas)
        {
          provide: AuthenticationService,
          useValue: authenticationServiceMock,
        },
        {
          provide: BookService,
          useValue: bookServiceMock,
        },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    bookService = TestBed.inject(BookService) as jasmine.SpyObj<BookService>;
    bookService.reloadBookCollections.and.returnValue(of());
    authenticationService = TestBed.inject(AuthenticationService) as jasmine.SpyObj<AuthenticationService>;
    harness = await RouterTestingHarness.create();
  });

  describe('enrutado', () => {
    it('debe crearse cuando el router navegue a la ruta principal', async () => {
      component = await harness.navigateByUrl('/', HomePageComponent);

      expect(component).toBeTruthy();
      expect(component instanceof HomePageComponent).toBeTrue();
      expect(router.url).toBe('/');

      const html = harness.routeNativeElement as HTMLElement;
      const homePageTitle = html.querySelector<HTMLHeadingElement>('h1');
      expect(homePageTitle?.textContent).toBe('Media Manager');
    });

    it('debe destruirse cuando el router navegue a otra ruta distinta', async () => {
      let finalComponent: HomePageComponent | BooksPageComponent = await harness.navigateByUrl('/', HomePageComponent);
      expect(finalComponent instanceof HomePageComponent).toBeTrue();

      finalComponent = await harness.navigateByUrl('books', BooksPageComponent);

      expect(finalComponent instanceof HomePageComponent).toBeFalse();
      expect(finalComponent instanceof BooksPageComponent).toBeTrue();
      expect(router.url).toBe('/books/collection-list'); // IMPORTANTE: esto es por el redirect que hemos definido en la ruta 'books'!
    });
  });
});
