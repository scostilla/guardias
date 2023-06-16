import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleDistributionComponent } from './schedule-distribution.component';

describe('ScheduleDistributionComponent', () => {
  let component: ScheduleDistributionComponent;
  let fixture: ComponentFixture<ScheduleDistributionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScheduleDistributionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScheduleDistributionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
