import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MinisterioEditComponent } from './ministerio-edit.component';

describe('MinisterioEditComponent', () => {
  let component: MinisterioEditComponent;
  let fixture: ComponentFixture<MinisterioEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MinisterioEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MinisterioEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
