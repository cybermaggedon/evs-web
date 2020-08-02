import { TestBed } from '@angular/core/testing';

import { SelectedRiskProfilesService } from './selected-risk-profiles.service';

describe('SelectedRiskProfilesService', () => {
  let service: SelectedRiskProfilesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SelectedRiskProfilesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
