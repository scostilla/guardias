import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UdoEditComponent } from './udo-edit.component';

describe('UdoEditComponent', () => {
  let component: UdoEditComponent;
  let fixture: ComponentFixture<UdoEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UdoEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UdoEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
