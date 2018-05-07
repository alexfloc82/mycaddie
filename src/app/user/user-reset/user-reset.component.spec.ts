import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserResetComponent } from './user-reset.component';

describe('UserResetComponent', () => {
  let component: UserResetComponent;
  let fixture: ComponentFixture<UserResetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserResetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserResetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
