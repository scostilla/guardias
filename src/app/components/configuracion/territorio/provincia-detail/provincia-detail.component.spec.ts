import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProvinciaDetailComponent } from './provincia-detail.component';

describe('ProvinciaDetailComponent', () => {
  let component: ProvinciaDetailComponent;
  let fixture: ComponentFixture<ProvinciaDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProvinciaDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProvinciaDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
