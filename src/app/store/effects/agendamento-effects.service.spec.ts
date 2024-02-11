import { TestBed } from '@angular/core/testing';

import { AgendamentoEffectsService } from './agendamento-effects.service';

describe('AgendamentoEffectsService', () => {
  let service: AgendamentoEffectsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AgendamentoEffectsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
