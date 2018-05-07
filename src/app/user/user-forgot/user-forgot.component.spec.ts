import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserForgotComponent } from './user-forgot.component';

describe('UserForgotComponent', () => {
  let component: UserForgotComponent;
  let fixture: ComponentFixture<UserForgotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserForgotComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserForgotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
