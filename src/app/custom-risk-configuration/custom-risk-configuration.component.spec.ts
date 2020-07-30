import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomRiskConfigurationComponent } from './custom-risk-configuration.component';

describe('CustomRiskConfigurationComponent', () => {
  let component: CustomRiskConfigurationComponent;
  let fixture: ComponentFixture<CustomRiskConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomRiskConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomRiskConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
