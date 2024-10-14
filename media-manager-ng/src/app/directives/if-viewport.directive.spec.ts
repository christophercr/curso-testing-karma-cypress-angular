import { Component } from '@angular/core';
import { IfViewportDirective } from './if-viewport.directive';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { BehaviorSubject, of, Subject } from 'rxjs';

describe('IfViewportDirective', () => {
  @Component({
    standalone: true,
    template: `
      <h1>Testing IfViewportDirective...</h1>
      <div *appIfViewport="'Large'; else otherContent">
        <p data-test="content-when-match">Shoud be shown when the viewport matches</p>
      </div>

      <ng-template #otherContent>
        <div data-test="content-when-no-match">Should be shown when the viewport does not match</div>
      </ng-template>
    `,
    imports: [IfViewportDirective],
  })  class TestIfViewportDirectiveComponent {}

  let component: TestIfViewportDirectiveComponent;
  let fixture: ComponentFixture<TestIfViewportDirectiveComponent>;
  let observerService: jasmine.SpyObj<BreakpointObserver>;
  const subject = new BehaviorSubject<BreakpointState>({breakpoints:{
    [Breakpoints.Large]:true
  },matches:true});
  const observerServiceMock = jasmine.createSpyObj('BreakpointObserver', ['observe']);

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      imports: [TestIfViewportDirectiveComponent, IfViewportDirective],
      providers: [
        {
          provide: BreakpointObserver,
          useValue: observerServiceMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TestIfViewportDirectiveComponent);
    component = fixture.componentInstance;
    observerService = TestBed.inject(BreakpointObserver) as jasmine.SpyObj<BreakpointObserver>;
    observerService.observe.and.returnValue(subject.asObservable());
    fixture.detectChanges();

  });
  it('debe mostrar las vista correspondiente en caso de que el viewport sea el deseado y en el caso en el que no', () => {

    const html = fixture.nativeElement as HTMLElement;
    let parrafoMatch = html.querySelector('[data-test="content-when-match"]') as HTMLParagraphElement;
    expect(parrafoMatch.innerHTML).toBe('Shoud be shown when the viewport matches');
    subject.next({breakpoints:{
      [Breakpoints.Large]:false,
      [Breakpoints.Medium]:true
    },matches:true})
    const parrafoNotMatch = html.querySelector('[data-test="content-when-no-match"]') as HTMLParagraphElement;
    expect(parrafoNotMatch.innerHTML).toBe('Should be shown when the viewport does not match');
    subject.next({breakpoints:{
      [Breakpoints.Large]:true,
      [Breakpoints.Medium]:false
    },matches:true})
    parrafoMatch = html.querySelector('[data-test="content-when-match"]') as HTMLParagraphElement;
    expect(parrafoMatch.innerHTML).toBe('Shoud be shown when the viewport matches');
  });
});
