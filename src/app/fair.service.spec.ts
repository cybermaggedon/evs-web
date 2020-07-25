import { TestBed } from '@angular/core/testing';

import { FairCurvesService } from './fair-curves.service';

describe('FairCurvesService', () => {
  let service: FairCurvesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FairCurvesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
