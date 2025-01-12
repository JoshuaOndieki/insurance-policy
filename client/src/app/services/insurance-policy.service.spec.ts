import { TestBed } from '@angular/core/testing';

import { InsurancePolicyService } from './insurance-policy.service';

describe('InsurancePolicyService', () => {
  let service: InsurancePolicyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InsurancePolicyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
