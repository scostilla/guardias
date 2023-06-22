import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchProfessionalComponent } from './search-professional.component';

describe('SearchProfessionalComponent', () => {
  let component: SearchProfessionalComponent;
  let fixture: ComponentFixture<SearchProfessionalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchProfessionalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchProfessionalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
