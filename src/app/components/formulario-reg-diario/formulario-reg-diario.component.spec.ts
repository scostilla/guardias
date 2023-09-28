import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioRegDiarioComponent } from './formulario-reg-diario.component';

describe('FormularioRegDiarioComponent', () => {
  let component: FormularioRegDiarioComponent;
  let fixture: ComponentFixture<FormularioRegDiarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormularioRegDiarioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormularioRegDiarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
