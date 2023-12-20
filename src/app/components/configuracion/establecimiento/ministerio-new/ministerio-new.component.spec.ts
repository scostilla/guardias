import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MinisterioNewComponent } from './ministerio-new.component';

describe('MinisterioNewComponent', () => {
  let component: MinisterioNewComponent;
  let fixture: ComponentFixture<MinisterioNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MinisterioNewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MinisterioNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
