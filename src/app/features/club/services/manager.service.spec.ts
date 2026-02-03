import { TestBed } from '@angular/core/testing';

import { ManagerService } from './manager.service';
import { firstValueFrom, Observable, of } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Manager } from '@libs/domain/models/manager.model';

describe('ManagerService', () => {
  let service: ManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: HttpClient,
          useValue: {
            get: (url: string, options: { params: HttpParams }): Observable<Manager | undefined> => {
              let response: Manager | undefined;
              const managers: Manager[] = [{
                clubId: '001',
                createdAt: 1704587,
                id: '002',
                name: 'Mourinho',
              }];
              if (url === '/managers/search') {
                response = managers.find(manager => manager.name.includes(options.params.get('name')!));
              } else {
                response = undefined;
              }
              return of(response);
            }
          }
        }
      ]
    });
    service = TestBed.inject(ManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('exists', () => {
    it('it should return true for given manager name', async () => {
      const exists = await firstValueFrom(service.exists('Mourinho'));
      expect(exists).toBe(true);
    });
  });
});
