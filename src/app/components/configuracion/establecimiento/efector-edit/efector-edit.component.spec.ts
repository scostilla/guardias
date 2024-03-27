import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EfectorEditComponent } from './efector-edit.component';

describe('EfectorEditComponent', () => {
  let component: EfectorEditComponent;
  let fixture: ComponentFixture<EfectorEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EfectorEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EfectorEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
