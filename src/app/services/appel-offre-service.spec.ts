import { TestBed } from '@angular/core/testing';

import { AppelOffreService } from './appel-offre-service';

describe('AppelOffreService', () => {
  let service: AppelOffreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppelOffreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
