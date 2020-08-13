import { TestBed } from '@angular/core/testing';

import { FairBackendService } from './fair-report.service';

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
