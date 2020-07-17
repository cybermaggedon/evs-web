import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskSliderComponent } from './risk-slider.component';

describe('RiskSliderComponent', () => {
  let component: RiskSliderComponent;
  let fixture: ComponentFixture<RiskSliderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RiskSliderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
