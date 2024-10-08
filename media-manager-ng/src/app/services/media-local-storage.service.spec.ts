import { TestBed } from '@angular/core/testing';

import { MediaLocalStorageService } from './media-local-storage.service';

xdescribe('MediaLocalStorageService', () => {
  let service: MediaLocalStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MediaLocalStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
