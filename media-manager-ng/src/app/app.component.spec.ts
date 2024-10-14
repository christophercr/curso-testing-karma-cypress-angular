import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { appConfig } from './app.config';
import { RouterTestingHarness } from '@angular/router/testing';
import { HomePageComponent } from './pages/home-page/home-page/home-page.component';
import { Router } from '@angular/router';

describe('AppComponent', () => {
  let harness: RouterTestingHarness;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      ...appConfig,
      imports: [AppComponent],
    }).compileComponents();

    router = TestBed.inject(Router);
    harness = await RouterTestingHarness.create();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the 'media-manager-ng' title`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('media-manager-ng');
  });

  describe('enrutado', () => {
    it('CON ASYNC-AWAIT - debe crear el HomePageComponente cuando el router navegue a la ruta principal', async () => {
      const component = await harness.navigateByUrl('/', HomePageComponent); // async await
      expect(component).toBeTruthy();
      expect(component instanceof HomePageComponent).toBeTrue();

      expect(router.url).toBeDefined();
    });

    it('CON THEN-CATCH - debe crear el HomePageComponente cuando el router navegue a la ruta principal', (done: DoneFn) => {
      harness
        .navigateByUrl('/', HomePageComponent)
        .then((component) => {
          expect(component).toBeTruthy();
          expect(component instanceof HomePageComponent).toBeTrue();
          expect(router.url).toBe('/');
          done();
        })
        .catch(() => {
          fail('La navegación a la ruta principal no debe fallar');
        });
    });
  });
});
