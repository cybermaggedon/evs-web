import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LossExceedenceChartComponent } from './loss-exceedence-chart.component';

describe('LossExceedenceChartComponent', () => {
  let component: LossExceedenceChartComponent;
  let fixture: ComponentFixture<LossExceedenceChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LossExceedenceChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LossExceedenceChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
