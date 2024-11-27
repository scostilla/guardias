import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MotivoBajaDialogComponent } from './motivo-baja-dialog.component';

describe('MotivoBajaDialogComponent', () => {
  let component: MotivoBajaDialogComponent;
  let fixture: ComponentFixture<MotivoBajaDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MotivoBajaDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MotivoBajaDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
