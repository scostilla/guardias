import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UdoDetailComponent } from './udo-detail.component';

describe('UdoDetailComponent', () => {
  let component: UdoDetailComponent;
  let fixture: ComponentFixture<UdoDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UdoDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UdoDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
