import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevistaDetailComponent } from './revista-detail.component';

describe('RevistaDetailComponent', () => {
  let component: RevistaDetailComponent;
  let fixture: ComponentFixture<RevistaDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RevistaDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RevistaDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
