import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse, HttpEventType, HttpInterceptorFn, HttpRequest, HttpResponse, type HttpHandlerFn } from '@angular/common/http';

import { httpErrorInterceptor } from './http-error.interceptor';
import { of, throwError } from 'rxjs';

describe('httpErrorInterceptor', () => {
  const interceptor: HttpInterceptorFn = (req, next) => TestBed.runInInjectionContext(() => httpErrorInterceptor(req, next));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('debe de re-lanzar un error en caso de que la peticion Http falle', (done: DoneFn) => {
    const dummyRequest = new HttpRequest('GET', '/some/url');

    const dummyHandlerErrorFn: HttpHandlerFn = (req: HttpRequest<unknown>) => {
      const failureResponse = new HttpErrorResponse({ error: 'response ERROR', status: 500 });

      return throwError(() => failureResponse);
    };

    interceptor(dummyRequest, dummyHandlerErrorFn).subscribe({
      next: () => {
        fail('No debe de emitir nada en next() en caso de que la petición Http falle');
      },
      error: (error) => {
        expect(error).toBeDefined();
        expect(error).toMatch(/HTTP Error interceptor: Http call failed due to error/);
        done();
      },
    });
  });

  it('no debe hacer nada con la respuesta en caso de que la peticion Http sea exitosa', (done: DoneFn) => {
    const dummyRequest = new HttpRequest('GET', '/some/url');

    const dummyHandlerSuccessFn: HttpHandlerFn = (req: HttpRequest<unknown>) => {
      const successResponse = new HttpResponse({ body: 'response SUCCESS', status: 200 });

      return of(successResponse);
    };

    interceptor(dummyRequest, dummyHandlerSuccessFn).subscribe({
      next: (response) => {
        expect(response).toBeDefined();
        expect(response.type).toBe(HttpEventType.Response);
        done();
      },
      error: () => {
        fail('No debe de haber error si la petición Http es exitosa');
      },
    });
  });
});
