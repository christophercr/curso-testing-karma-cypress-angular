import { TestBed } from '@angular/core/testing';

import { AuthenticationService } from './authentication.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { User, UserType } from '../models/user.model';
import { of } from 'rxjs';

fdescribe('AuthenticationService', () => {
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
  });
});
