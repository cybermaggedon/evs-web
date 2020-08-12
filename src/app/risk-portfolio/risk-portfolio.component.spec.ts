import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskPortfolioComponent } from './risk-portfolio.component';

describe('RiskPortfolioComponent', () => {
  let component: RiskPortfolioComponent;
  let fixture: ComponentFixture<RiskPortfolioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RiskPortfolioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskPortfolioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
