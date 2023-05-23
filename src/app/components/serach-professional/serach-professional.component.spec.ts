import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SerachProfessionalComponent } from './serach-professional.component';

describe('SerachProfessionalComponent', () => {
  let component: SerachProfessionalComponent;
  let fixture: ComponentFixture<SerachProfessionalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SerachProfessionalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SerachProfessionalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
