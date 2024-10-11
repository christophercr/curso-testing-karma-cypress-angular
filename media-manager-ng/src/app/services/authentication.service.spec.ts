import { TestBed } from '@angular/core/testing';

import { AuthenticationService } from './authentication.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { User, UserType } from '../models/user.model';
import { of, switchMap, throwError } from "rxjs";
import { TestScheduler } from "rxjs/internal/testing/TestScheduler";

describe('AuthenticationService', () => {
  let service: AuthenticationService;

  let httpService: jasmine.SpyObj<HttpClient>;
  const apiUrl = environment.usersApiUrl;

  beforeEach(() => {
    const httpClientMock = jasmine.createSpyObj('HttpClient', ['post', 'delete', 'get']);
    TestBed.configureTestingModule({
      providers: [
        {
          provide: HttpClient,
          useValue: httpClientMock,
        },
      ],
    });

    httpService = TestBed.inject(HttpClient) as jasmine.SpyObj<HttpClient>;
    service = TestBed.inject(AuthenticationService);
  });
  const user = UserType.Admin;

  const todosLosUsuarios: User[] = [
    {
      id: '1',
      username: 'administrator',
      password: '1234',
      userType: UserType.Admin,
    },
    {
      id: '2',
      username: 'some user',
      password: 'abcd',
      userType: UserType.ReadOnly,
    },
  ];

  describe('Vamos a probar el método para simular un login: ' + 'simulateLogin()', () => {
    it('Debe simular que se ha logado un usuario con un el rol indicado y con credenciales correctas', (done: DoneFn) => {
      httpService.get.and.returnValue(of(todosLosUsuarios));
      expect(service).toBeTruthy();
      service.simulateLogin(user).subscribe({
        next: (userRespuesa) => {
          expect(httpService.get).toHaveBeenCalledTimes(1);
          expect(httpService.get).toHaveBeenCalledWith(`${environment.usersApiUrl}users`);
          expect(userRespuesa).toEqual(todosLosUsuarios[0]);
          done();
        },
        error: () => {
          fail('No debe fallar la recuperación de un usuario correcto');
        },
      });
    });

    it('V2 - Debe simular que se ha logado un usuario con un el rol indicado y con credenciales correctas', (done: DoneFn) => {
      httpService.get.and.returnValue(of(todosLosUsuarios));
      service
        .simulateLogin(UserType.ReadOnly)
        .pipe(
          // encadenamos la llamada al simulateLogin con otro tipo de usuario
          switchMap((user) => {
            expect(user).toEqual(todosLosUsuarios[1]); // todosLosUsuarios[1] contiene el user de tipo readonly
            expect(httpService.get).toHaveBeenCalledTimes(1);
            expect(httpService.get).toHaveBeenCalledWith(`${apiUrl}users`);
            httpService.get.calls.reset();

            return service.simulateLogin(UserType.Admin);
          }),
        )
        .subscribe({
          next: (userRespuesa) => {
            expect(httpService.get).toHaveBeenCalledTimes(1);
            expect(httpService.get).toHaveBeenCalledWith(`${environment.usersApiUrl}users`);
            expect(userRespuesa).toEqual(todosLosUsuarios[0]); // todosLosUsuarios[0] contiene el user de tipo admin
            done();
          },
          error: () => {
            fail('No debe fallar la recuperación de un usuario correcto');
          },
        });
    });

    it('Debe simular que sin pasar un usuario devuelva uno aleatorio', (done: DoneFn) => {
      httpService.get.and.returnValue(of(todosLosUsuarios));
      expect(service).toBeTruthy();
      service.simulateLogin().subscribe({
        next: (userRespuesta) => {
          expect(httpService.get).toHaveBeenCalledTimes(1);
          expect(httpService.get).toHaveBeenCalledWith(`${environment.usersApiUrl}users`);
          if (userRespuesta.id === '1') {
            expect(userRespuesta).toEqual(todosLosUsuarios[0]);
          } else {
            expect(userRespuesta).toEqual(todosLosUsuarios[1]);
          }
          done();
        },
        error: () => {
          fail('No debe fallar la recuperación de un usuario correcto');
        },
      });
    });

    xit('debe reintentar la llamada máximo 3 veces en caso de fallo', (done: DoneFn) => {
      const numberOfRetries = 3;
      let retryCount = 0;

      const httpErrorResponse$ = throwError(() => {
        retryCount++;
        return new Error('get ERROR');
      });
      httpService.get.and.returnValue(httpErrorResponse$);

      service.simulateLogin().subscribe({
        next: () => {
          fail('La llamada debe fallar porque estamos probando los reintentos en caso de fallos');
        },
        error: () => {
          expect(retryCount).toEqual(1 + numberOfRetries); // error en la petición inicial + número de reintentos
          expect(httpService.get).toHaveBeenCalledTimes(1);
          expect(httpService.get).toHaveBeenCalledWith(`${apiUrl}users`);

          done();
        },
      });
    });

    it('MARBLE TESTING - debe reintentar la llamada máximo 3 veces en caso de fallo', () => {
      const numberOfRetries = 3;
      let retryCount = 0;

      const httpErrorResponse$ = throwError(() => {
        if (retryCount > 0) {
          console.log('------ retry number', retryCount);
        }
        retryCount++;
        expect(retryCount).toBeLessThanOrEqual(1 + numberOfRetries); // error en la petición inicial + número de reintentos
        return new Error('get ERROR');
      });
      httpService.get.and.returnValue(httpErrorResponse$);

      const testScheduler = new TestScheduler((actual, expected) => {
        expect(actual).toEqual(expected);
      });

      testScheduler.run((helpers) => {
        const { expectObservable, flush } = helpers;

        const expected = '32000ms #'; // 1000 + 4000 + 27000 = 32000 porque hacemos Math.pow(retryCount, retryCount) * 1000

        expectObservable(service.simulateLogin()).toBe(expected, {}, new Error('get ERROR'));

        flush(); // dejar correr 'tiempo virtual' para completar el observable del simulateLogin()

        expect(retryCount).toBe(1 + numberOfRetries); // error en la petición inicial + número de reintentos
      });
    });
  });
});
