import { TestBed } from '@angular/core/testing';
import { HttpEventType, HttpHandlerFn, HttpInterceptorFn, HttpRequest, HttpResponse } from '@angular/common/http';

import { httpAuthorizationInterceptor } from './http-authorization.interceptor';
import { of } from 'rxjs';

fdescribe('httpAuthorizationInterceptor', () => {
  const interceptor: HttpInterceptorFn = (req, next) => TestBed.runInInjectionContext(() => httpAuthorizationInterceptor(req, next));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('la cabecera de autorización se añade a las peticiones POST', (done: DoneFn) => {
    const dummyRequest = new HttpRequest('POST', '/some/url', {});

    const dummyHandlerErrorFn: HttpHandlerFn = (request: HttpRequest<unknown>) => {
      const requestHeaders = request.headers.get('X-Authorization');
      expect(requestHeaders).toEqual('my-api-token');

      const successResponse = new HttpResponse({ body: 'response SUCCESS', status: 200 });
      return of(successResponse);
    };

    interceptor(dummyRequest, dummyHandlerErrorFn).subscribe({
      next: (response) => {
        done();
      },
      error: () => {
        fail('No debe de haber error si la petición Http es exitosa');
      },
    });
  });
  it('la cabecera de autorización no se añade a las peticiones diferentes de POST', (done: DoneFn) => {
    const dummyRequest = new HttpRequest('GET', '/some/url', {});
    const dummyHandlerErrorFn: HttpHandlerFn = (request: HttpRequest<unknown>) => {
      const requestHeaders = request.headers.get('X-Authorization');
      expect(requestHeaders).not.toEqual('my-api-token');
      expect(requestHeaders).toBeFalsy();

      const successResponse = new HttpResponse({ body: 'response SUCCESS', status: 200 });
      return of(successResponse);
     
    };  

    interceptor(dummyRequest, dummyHandlerErrorFn).subscribe({
      next: (response) => {
        done();
      },
      error: () => {
        fail('No debe de haber error si la petición Http es exitosa');
      },
    });

  }); 
});
