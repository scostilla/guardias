import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PruebaNotiComponent } from './prueba-noti.component';

describe('PruebaNotiComponent', () => {
  let component: PruebaNotiComponent;
  let fixture: ComponentFixture<PruebaNotiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PruebaNotiComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PruebaNotiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
