import { TestBed } from '@angular/core/testing';

import { ModelStateService } from './model-state.service';

describe('ModelStateService', () => {
  let service: ModelStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModelStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
