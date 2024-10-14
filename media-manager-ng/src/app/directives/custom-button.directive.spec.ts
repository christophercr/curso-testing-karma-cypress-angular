import { Component } from '@angular/core';
import { CustomButtonDirective } from './custom-button.directive';
import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

describe('CustomButtonDirective', () => {
  @Component({
    standalone: true,
    template: `
      <button type="button">Primer botón</button>
      <button type="button">Segundo botón</button>
      <button type="button">Tercer botón</button>
    `,
    imports: [CustomButtonDirective],
  })
  class TestCustomButtonDirectiveComponent {}

  let component: TestCustomButtonDirectiveComponent;
  let fixture: ComponentFixture<TestCustomButtonDirectiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomButtonDirective, TestCustomButtonDirectiveComponent],
      providers: [],
    }).compileComponents();

    fixture = TestBed.createComponent(TestCustomButtonDirectiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crear una nueva directiva con cada botón', () => {
    const buttons = fixture.debugElement.queryAll(By.css('button[type="button"]')); // = html.querySelectorAll()
    expect(buttons.length).toBe(3);

    const directives = fixture.debugElement.queryAll(By.directive(CustomButtonDirective));
    expect(directives.length).toBe(3);
  });

  it('debe aplicar los estilos correctamente a cada botón', () => {
    const buttons = fixture.debugElement.queryAll(By.css('button[type="button"]'));
    expect(buttons.length).toBe(3);

    // estilos que sabemos de antemano que setea nuestra directiva CustomButtonDirective
    const expectedStyles: Partial<Record<keyof CSSStyleDeclaration, string>> = {
      borderRadius: '10px',
      color: 'white',
      fontSize: '1rem',
      fontWeight: 'bold',
    };

    // loop en las keys de un objeto
    for (const style in expectedStyles) {
      // loop en los elementos de un array
      for (const button of buttons) {
        expect(button.styles[style]).toBe(expectedStyles[style] as string);
      }
    }
  });
});
