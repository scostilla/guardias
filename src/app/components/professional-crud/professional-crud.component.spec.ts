import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfessionalCrudComponent } from './professional-crud.component';

describe('ProfessionalCrudComponent', () => {
  let component: ProfessionalCrudComponent;
  let fixture: ComponentFixture<ProfessionalCrudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfessionalCrudComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfessionalCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
