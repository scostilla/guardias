import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfessionalNewsComponent } from './professional-news.component';

describe('ProfessionalNewsComponent', () => {
  let component: ProfessionalNewsComponent;
  let fixture: ComponentFixture<ProfessionalNewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfessionalNewsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfessionalNewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
