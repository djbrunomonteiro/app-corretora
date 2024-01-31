import { TestBed } from '@angular/core/testing';

import { ClienteEffectsService } from './cliente-effects.service';

describe('ClienteEffectsService', () => {
  let service: ClienteEffectsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClienteEffectsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
