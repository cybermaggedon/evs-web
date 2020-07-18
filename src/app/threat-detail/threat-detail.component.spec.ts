import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreatDetailComponent } from './threat-detail.component';

describe('ThreatDetailComponent', () => {
  let component: ThreatDetailComponent;
  let fixture: ComponentFixture<ThreatDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThreatDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThreatDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
