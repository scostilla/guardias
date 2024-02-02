import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificacionEditComponent } from './notificacion-edit.component';

describe('NotificacionEditComponent', () => {
  let component: NotificacionEditComponent;
  let fixture: ComponentFixture<NotificacionEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotificacionEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotificacionEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
