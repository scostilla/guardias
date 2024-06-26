import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevistaEditComponent } from './revista-edit.component';

describe('RevistaEditComponent', () => {
  let component: RevistaEditComponent;
  let fixture: ComponentFixture<RevistaEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RevistaEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RevistaEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
