import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewMediaCollectionComponent } from './new-media-collection.component';

describe('NewMediaCollectionComponent', () => {
  let component: NewMediaCollectionComponent;
  let fixture: ComponentFixture<NewMediaCollectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewMediaCollectionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NewMediaCollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
