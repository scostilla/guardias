import { TestBed } from '@angular/core/testing';

import { IdleTimeoutServiceService } from './idle-timeout-service.service';

describe('IdleTimeoutServiceService', () => {
  let service: IdleTimeoutServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IdleTimeoutServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
