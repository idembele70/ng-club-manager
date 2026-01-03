import { TestBed } from '@angular/core/testing';

import { ClubService } from './club.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Club } from '../models/club.model';
import { firstValueFrom, Observable, of } from 'rxjs';

describe('ClubService', () => {
  let service: ClubService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: HttpClient,
          useValue: {
            get: (url: string, options: { params: HttpParams }): Observable<Club | undefined> => {
              let response: Club | undefined;
              const clubs: Club[] = [{
                id: '001',
                balance: 100_000,
                createdAt: 1704587,
                managerId: '002',
                name: 'FC Porto',
                passwordEncrypted: 'Encrypted-P@ssw0rd?!'
              }];
              if (url === '/clubs/search') {
                response = clubs.find(club => club.name.includes(options.params.get('name')!));
              } else {
                response = undefined;
              }
              return of(response);
            }
          }
        }
      ]
    });
    service = TestBed.inject(ClubService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('exists', () => {
    it('should return true when given club name exists', async () => {
      const exists = await firstValueFrom(service.exists('FC Porto'));
      expect(exists).toBe(true);
    });
    it("should return false when given club name doesn't exists", async () => {
      const exists = await firstValueFrom(service.exists('FC Barcelona'));
      expect(exists).toBe(false);
    });
  });
});
