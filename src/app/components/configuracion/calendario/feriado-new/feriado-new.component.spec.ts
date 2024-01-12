import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeriadoNewComponent } from './feriado-new.component';

describe('FeriadoNewComponent', () => {
  let component: FeriadoNewComponent;
  let fixture: ComponentFixture<FeriadoNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeriadoNewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeriadoNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
