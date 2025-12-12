import { TestBed } from '@angular/core/testing';

import { DossierAoService } from './dossier-ao-service';

describe('DossierAoService', () => {
  let service: DossierAoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DossierAoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
