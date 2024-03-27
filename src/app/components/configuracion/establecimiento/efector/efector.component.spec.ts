import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EfectorComponent } from './efector.component';

describe('EfectorComponent', () => {
  let component: EfectorComponent;
  let fixture: ComponentFixture<EfectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EfectorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EfectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
