import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfsessionalFormComponent } from './profsessional-form.component';

describe('ProfsessionalFormComponent', () => {
  let component: ProfsessionalFormComponent;
  let fixture: ComponentFixture<ProfsessionalFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfsessionalFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfsessionalFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
