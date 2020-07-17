import { TestBed } from '@angular/core/testing';

import { RiskWindowService } from './risk-window.service';

describe('RiskWindowService', () => {
  let service: RiskWindowService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RiskWindowService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
