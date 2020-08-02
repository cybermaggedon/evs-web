import { TestBed } from '@angular/core/testing';

import { SelectedModelService } from './selected-model.service';

describe('SelectedModelService', () => {
  let service: SelectedModelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SelectedModelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
