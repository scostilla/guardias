import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RmensualExtraDetailComponent } from './rmensual-extra-detail.component';

describe('RmensualExtraDetailComponent', () => {
  let component: RmensualExtraDetailComponent;
  let fixture: ComponentFixture<RmensualExtraDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RmensualExtraDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RmensualExtraDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
