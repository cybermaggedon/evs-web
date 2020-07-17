import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceRiskComponent } from './device-risk.component';

describe('DeviceRiskComponent', () => {
  let component: DeviceRiskComponent;
  let fixture: ComponentFixture<DeviceRiskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceRiskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceRiskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
