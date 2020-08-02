import { TestBed } from '@angular/core/testing';

import { RiskLoaderService } from './risk-loader.service';

describe('RiskLoaderService', () => {
  let service: RiskLoaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RiskLoaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
