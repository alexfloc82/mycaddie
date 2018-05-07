import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HoleViewComponent } from './hole-view.component';

describe('HoleViewComponent', () => {
  let component: HoleViewComponent;
  let fixture: ComponentFixture<HoleViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HoleViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HoleViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
