import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreatModelComponent } from './threat-model.component';

describe('ThreatModelComponent', () => {
  let component: ThreatModelComponent;
  let fixture: ComponentFixture<ThreatModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThreatModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThreatModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
