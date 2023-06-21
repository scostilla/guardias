import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfessionalAbmComponent } from './professional-abm.component';

describe('ProfessionalAbmComponent', () => {
  let component: ProfessionalAbmComponent;
  let fixture: ComponentFixture<ProfessionalAbmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfessionalAbmComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfessionalAbmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
