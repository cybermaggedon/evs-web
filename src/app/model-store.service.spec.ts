import { TestBed } from '@angular/core/testing';

import { ModelStoreService } from './model-store.service';

describe('ModelStoreService', () => {
  let service: ModelStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModelStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
