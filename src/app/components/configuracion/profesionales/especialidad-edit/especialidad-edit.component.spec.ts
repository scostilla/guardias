import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EspecialidadEditComponent } from './especialidad-edit.component';

describe('EspecialidadEditComponent', () => {
  let component: EspecialidadEditComponent;
  let fixture: ComponentFixture<EspecialidadEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EspecialidadEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EspecialidadEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
