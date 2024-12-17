import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectorRolesComponent } from './selector-roles.component';

describe('SelectorRolesComponent', () => {
  let component: SelectorRolesComponent;
  let fixture: ComponentFixture<SelectorRolesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectorRolesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectorRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
