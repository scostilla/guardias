import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProvinciaEditComponent } from './provincia-edit.component';

describe('ProvinciaEditComponent', () => {
  let component: ProvinciaEditComponent;
  let fixture: ComponentFixture<ProvinciaEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProvinciaEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProvinciaEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
