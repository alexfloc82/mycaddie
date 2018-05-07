import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HoleEditorComponent } from './hole-editor.component';

describe('HoleEditorComponent', () => {
  let component: HoleEditorComponent;
  let fixture: ComponentFixture<HoleEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HoleEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HoleEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
