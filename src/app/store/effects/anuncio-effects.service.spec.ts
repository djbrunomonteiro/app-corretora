import { TestBed } from '@angular/core/testing';

import { AnuncioEffectsService } from './anuncio-effects.service';

describe('AnuncioEffectsService', () => {
  let service: AnuncioEffectsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnuncioEffectsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
