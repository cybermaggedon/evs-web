import { TestBed } from '@angular/core/testing';

import { RiskStateService } from './risk-state.service';

describe('RiskStateService', () => {
  let service: RiskStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RiskStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
