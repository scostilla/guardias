import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeriadoDetailComponent } from './feriado-detail.component';

describe('FeriadoDetailComponent', () => {
  let component: FeriadoDetailComponent;
  let fixture: ComponentFixture<FeriadoDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeriadoDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeriadoDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
