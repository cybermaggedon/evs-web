import { TestBed } from '@angular/core/testing';

import { RiskGraphService } from './risk-graph.service';

describe('RiskGraphService', () => {
  let service: RiskGraphService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RiskGraphService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
