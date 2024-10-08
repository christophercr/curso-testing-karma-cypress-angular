import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewMediaCollectionComponent } from './new-media-collection.component';
import { BookService } from '../../services/book.service';
import { inject } from '@angular/core';
import { delay } from 'rxjs';

describe('NewMediaCollectionComponent', () => {
  let component: NewMediaCollectionComponent;
  let fixture: ComponentFixture<NewMediaCollectionComponent>;
  let bookService: jasmine.SpyObj<BookService>;

  beforeEach(async () => {
    const bookServiceMock = jasmine.createSpyObj('BookService', ['createBookCollection']);
    
    await TestBed.configureTestingModule({
      imports: [NewMediaCollectionComponent],
      providers: [
        {
          provide: BookService,
          useValue: bookServiceMock,
        }
      ],
    }).compileComponents();

    bookService = TestBed.inject(BookService) as jasmine.SpyObj<BookService>;
    fixture = TestBed.createComponent(NewMediaCollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('inputs:', () => {
    describe('dado el input "inputNname"', () => {
      it('debe de poner el valor en la caja de texto del nombre de la colección', () => {
        component.inputName = 'otro valor';
        const compiledHtml = fixture.nativeElement as HTMLElement;
        const inputBox = compiledHtml.querySelector('[data-test="field-collection-name"]') as HTMLInputElement;
        expect(inputBox.value).toBe('otro valor');
      });
    });
  });

  describe('outputs:', () => {
    describe('reloadClicked', () => {
      it('debe emitir un evento cuando el botón "Reload collections" es clickado', () => {
        const spy = spyOn(component.reloadClicked, 'emit');

        const compiledHtml = fixture.nativeElement as HTMLElement;
        const button = compiledHtml.querySelector('[data-test="btn-reload-collections"]') as HTMLButtonElement;
        button.click();

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith();
      });
    });
    describe('collectionCreated', () => {
      it('debe emitir un evento cuando el botón "Create" es clickado', (done:DoneFn) => {
        bookService.createBookCollection.and.returnValue(new Promise(
            (resolve, reject) => {
              setTimeout(() => {resolve()}, 1000);
            })
        );

        bookService.createBookCollection('').then(() => {
          setTimeout(() => {
            expect(spy).toHaveBeenCalledTimes(1);
            expect(spy).toHaveBeenCalledWith('carasui');
            done();
          }, 50);
        })

        const spy = spyOn(component.collectionCreated, 'emit');
        
        fixture.componentInstance.collectionName.setValue('carasui');
        fixture.detectChanges();

        const compiledHtml = fixture.nativeElement as HTMLElement;
        const button = compiledHtml.querySelector('[data-test="button-create"]') as HTMLButtonElement;
        console.log(button);
        button.click();
      });
    });
  });
});
