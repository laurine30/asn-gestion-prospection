import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Client, ClientService } from '../services/client-service';

describe('ClientService', () => {
  let service: ClientService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ClientService]
    });

    service = TestBed.inject(ClientService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch clients', () => {
    const dummyClients: Client[] = [
      {
        idClient: 1,
        typeClient: 'PHYSIQUE',
        nom: 'Doe',
        prenom: 'John',
        nomEntreprise: undefined,
        tel: '123',
        email: 'a@b.com',
        adresse: 'Address 1'
      },
      {
        idClient: 2,
        typeClient: 'MORAL',
        nom: undefined,
        prenom: undefined,
        nomEntreprise: 'Acme Corp',
        tel: '456',
        email: 'c@d.com',
        adresse: 'Address 2'
      }
    ];

    service.getClientsList().subscribe(clients => {
      expect(clients.length).toBe(2);
      expect(clients).toEqual(dummyClients);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/v1/clients');
    expect(req.request.method).toBe('GET');
    req.flush(dummyClients);
  });
});
