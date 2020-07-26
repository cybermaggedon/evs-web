import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProbabilityDistributionChartComponent } from './probability-distribution-chart.component';

describe('ProbabilityDistributionChartComponent', () => {
  let component: ProbabilityDistributionChartComponent;
  let fixture: ComponentFixture<ProbabilityDistributionChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProbabilityDistributionChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProbabilityDistributionChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
