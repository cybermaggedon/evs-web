import { TestBed } from '@angular/core/testing';

import { FinalRiskService } from './final-risk.service';

describe('FinalRiskService', () => {
  let service: FinalRiskService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FinalRiskService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
