import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CapsNewComponent } from './caps-new.component';

describe('CapsNewComponent', () => {
  let component: CapsNewComponent;
  let fixture: ComponentFixture<CapsNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CapsNewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CapsNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
