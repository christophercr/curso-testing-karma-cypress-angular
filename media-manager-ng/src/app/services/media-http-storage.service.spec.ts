import { TestBed } from '@angular/core/testing';

import { MediaHttpStorageService } from './media-http-storage.service';

xdescribe('MediaHttpStorageService', () => {
  let service: MediaHttpStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MediaHttpStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
