import { TestBed } from '@angular/core/testing';

import { EventSearchTermsService } from './event-search-terms.service';

describe('EventSearchTermsService', () => {
  let service: EventSearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventSearchTermsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
