import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalNewComponent } from './hospital-new.component';

describe('HospitalNewComponent', () => {
  let component: HospitalNewComponent;
  let fixture: ComponentFixture<HospitalNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HospitalNewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HospitalNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
