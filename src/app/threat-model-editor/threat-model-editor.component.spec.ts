import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreatModelEditorComponent } from './threat-model-editor.component';

describe('ThreatModelEditorComponent', () => {
  let component: ThreatModelEditorComponent;
  let fixture: ComponentFixture<ThreatModelEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThreatModelEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThreatModelEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
