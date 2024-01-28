import { TestBed } from '@angular/core/testing';

import { LeadEffectsService } from './lead-effects.service';

describe('LeadEffectsService', () => {
  let service: LeadEffectsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LeadEffectsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
