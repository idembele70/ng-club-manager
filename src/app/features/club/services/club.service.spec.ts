import { TestBed } from '@angular/core/testing';

import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { firstValueFrom } from 'rxjs';
import { Club } from '../models/club.model';
import { ClubService } from './club.service';

describe('ClubService', () => {
  let service: ClubService;
  let httpMock: HttpTestingController;
  const mockClub: Club = {
    id: '0d41-df14d5-df45d1',
    balance: 100_000_000,
    createdAt: 1704587,
    managerId: '002',
    name: 'FC Porto',
    passwordEncrypted: 'Encrypted-P@ssw0rd?!',
    abbreviation: 'POR',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ]
    });
    service = TestBed.inject(ClubService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('exists', () => {
    it('should return true when given club name exists', async () => {
      const clubName: Club['name'] = 'FC Porto'
      const response = firstValueFrom(service.exists(clubName));
      httpMock
        .expectOne(req =>
          req.url === '/clubs/search' &&
          req.method === 'GET' &&
          req.params.get('name') === clubName
        )
        .flush(mockClub);
      const exists = await response;
      expect(exists).toBe(true);
    });
    it("should return false when given club name doesn't exists", async () => {
      const clubName: Club['name'] = 'FC Barcelona'
      const response = firstValueFrom(service.exists(clubName));
      httpMock
        .expectOne(req =>
          req.url === '/clubs/search' &&
          req.method === 'GET' &&
          req.params.get('name') === clubName
        )
        .flush(null);
      const exists = await response;
      expect(exists).toBe(false);
    });
  });
});
