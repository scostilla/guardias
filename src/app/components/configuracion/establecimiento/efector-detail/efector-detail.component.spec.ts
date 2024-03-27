import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EfectorDetailComponent } from './efector-detail.component';

describe('EfectorDetailComponent', () => {
  let component: EfectorDetailComponent;
  let fixture: ComponentFixture<EfectorDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EfectorDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EfectorDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
