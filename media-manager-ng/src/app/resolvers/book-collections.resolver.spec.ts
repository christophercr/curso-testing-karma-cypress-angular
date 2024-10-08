import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { bookCollectionsResolver } from './book-collections.resolver';
import type { MediaCollection } from '../models/media-collection.model';
import type { Book } from '../models/book.model';

xdescribe('bookCollectionsResolver', () => {
  const executeResolver: ResolveFn<Map<string, MediaCollection<Book>>> = (...resolverParameters) =>
    TestBed.runInInjectionContext(() => bookCollectionsResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
