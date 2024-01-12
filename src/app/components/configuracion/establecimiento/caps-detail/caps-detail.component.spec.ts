import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CapsDetailComponent } from './caps-detail.component';

describe('CapsDetailComponent', () => {
  let component: CapsDetailComponent;
  let fixture: ComponentFixture<CapsDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CapsDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CapsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
