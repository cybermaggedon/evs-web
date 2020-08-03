import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskConfigurationFilterComponent } from './risk-configuration-filter.component';

describe('RiskConfigurationFilterComponent', () => {
  let component: RiskConfigurationFilterComponent;
  let fixture: ComponentFixture<RiskConfigurationFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RiskConfigurationFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskConfigurationFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
