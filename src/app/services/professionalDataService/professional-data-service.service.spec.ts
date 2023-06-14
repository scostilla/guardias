import { TestBed } from '@angular/core/testing';

import { ProfessionalDataServiceService } from './professional-data-service.service';

describe('ProfessionalDataServiceService', () => {
  let service: ProfessionalDataServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProfessionalDataServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
