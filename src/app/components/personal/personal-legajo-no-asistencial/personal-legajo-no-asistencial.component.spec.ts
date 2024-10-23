import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalLegajoNoAsistencialComponent } from './personal-legajo-no-asistencial.component';

describe('PersonalLegajoNoAsistencialComponent', () => {
  let component: PersonalLegajoNoAsistencialComponent;
  let fixture: ComponentFixture<PersonalLegajoNoAsistencialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PersonalLegajoNoAsistencialComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonalLegajoNoAsistencialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
