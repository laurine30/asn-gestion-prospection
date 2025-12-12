import { TestBed } from '@angular/core/testing';

import { AppelofrreService } from './appelofrre-service';

describe('AppelofrreService', () => {
  let service: AppelofrreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppelofrreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
