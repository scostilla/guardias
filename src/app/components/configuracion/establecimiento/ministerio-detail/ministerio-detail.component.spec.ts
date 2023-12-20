import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MinisterioDetailComponent } from './ministerio-detail.component';

describe('MinisterioDetailComponent', () => {
  let component: MinisterioDetailComponent;
  let fixture: ComponentFixture<MinisterioDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MinisterioDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MinisterioDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
