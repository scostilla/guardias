import { TestBed } from '@angular/core/testing';

import { AutoridadEfectorService } from './autoridad-efector.service';

describe('AutoridadEfectorService', () => {
  let service: AutoridadEfectorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AutoridadEfectorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
