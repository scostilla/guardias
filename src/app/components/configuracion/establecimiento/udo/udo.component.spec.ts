import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UdoComponent } from './udo.component';

describe('UdoComponent', () => {
  let component: UdoComponent;
  let fixture: ComponentFixture<UdoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UdoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UdoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
