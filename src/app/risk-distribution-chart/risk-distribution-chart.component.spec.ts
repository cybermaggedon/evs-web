import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskDistributionChartComponent } from './risk-distribution-chart.component';

describe('RiskDistributionChartComponent', () => {
  let component: RiskDistributionChartComponent;
  let fixture: ComponentFixture<RiskDistributionChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RiskDistributionChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskDistributionChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
