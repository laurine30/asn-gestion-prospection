import { TestBed } from '@angular/core/testing';
import { ListProspectionService } from './listprospect-service';



describe('ListprospectService', () => {
  let service: ListProspectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ListProspectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
