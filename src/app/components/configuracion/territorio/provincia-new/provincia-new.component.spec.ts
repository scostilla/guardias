import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProvinciaNewComponent } from './provincia-new.component';

describe('ProvinciaNewComponent', () => {
  let component: ProvinciaNewComponent;
  let fixture: ComponentFixture<ProvinciaNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProvinciaNewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProvinciaNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
