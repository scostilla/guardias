import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RmensualContrafacturaDetailComponent } from './rmensual-contrafactura-detail.component';

describe('RmensualContrafacturaDetailComponent', () => {
  let component: RmensualContrafacturaDetailComponent;
  let fixture: ComponentFixture<RmensualContrafacturaDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RmensualContrafacturaDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RmensualContrafacturaDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
