import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeriadoEditComponent } from './feriado-edit.component';

describe('FeriadoEditComponent', () => {
  let component: FeriadoEditComponent;
  let fixture: ComponentFixture<FeriadoEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeriadoEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeriadoEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
