import { TestBed } from '@angular/core/testing';

import { FairReportService } from './fair-report.service';

describe('FairReportService', () => {
  let service: FairReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FairReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
