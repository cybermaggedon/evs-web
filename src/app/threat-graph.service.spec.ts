import { TestBed } from '@angular/core/testing';

import { ThreatGraphService } from './threat-graph.service';

describe('ThreatGraphService', () => {
  let service: ThreatGraphService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThreatGraphService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
