import { TestBed } from '@angular/core/testing';

import { ThreatModelService } from './threat-model.service';

describe('ThreatModelService', () => {
  let service: ThreatModelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThreatModelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
