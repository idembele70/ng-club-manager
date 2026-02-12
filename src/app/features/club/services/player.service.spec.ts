import { TestBed } from '@angular/core/testing';

import { PlayerService } from './player.service';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Player } from '@libs/domain/models/player.model';
import { createPlayer } from '@/features/market/factories/player.factory';
import { firstValueFrom } from 'rxjs';

describe('PlayerService', () => {
  let service: PlayerService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(PlayerService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAll', () => {
    it('should get all players of one club', async () => {
      const clubId = '1dfd47-d4f1s1c-g4f45fd';
      const playersCount = 2;
      const mockPlayers: Player[] = Array.from({ length: playersCount }, () => createPlayer({ clubId }));
      const mockResponse = { players: mockPlayers, playersCount };
      const promise = firstValueFrom(service.getAll({ clubId }));

      httpMock
        .expectOne(req =>
          req.url === '/players' &&
          req.method === 'GET' &&
          req.params.get('clubId') === clubId
        )
        .flush(mockResponse);
      const response = await promise;
      expect(response).toEqual(mockResponse);
    })
  });
});
