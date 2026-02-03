import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { firstValueFrom } from 'rxjs';

import { createClub } from '@/features/club/factories/club.factory';
import { Club } from '@libs/domain/models/club.model';
import { createPlayer } from '../factories/player.factory';
import { Player } from '@/shared/models/player.model';
import { MarketService } from './market.service';

describe('MarketService', () => {
  let service: MarketService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(MarketService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  })
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getPlayersForSale', () => {
    it('should get players available for sale', async () => {
      const playersCount = 2;
      const mockPlayers: Player[] = Array.from({ length: playersCount }, createPlayer);
      const promise = firstValueFrom(service.getPlayersForSale({ limit: 20, offset: 0 }));

      httpMock
        .expectOne(req =>
          req.url === '/markets/players' &&
          req.method === 'GET' &&
          req.params.get('limit') === '20' &&
          req.params.get('offset') === '0'
        )
        .flush({ players: mockPlayers, playersCount });

      const data = await promise;
      expect(data.players).toEqual(mockPlayers);
      expect(data.playersCount).toEqual(playersCount);
    });
  });

  describe('buyPlayer', () => {
    it('should successfully buy a player', async () => {
      const mockClub: Club = createClub();
      const mockPlayer: Player = createPlayer({clubId: mockClub.id});
      const mockResponse = { clubName: mockClub.id, playerFullName: mockPlayer.fullName, price: mockPlayer.price };
      const promise = firstValueFrom(service.buyPlayer(mockPlayer.id));
      httpMock
        .expectOne(req =>
          req.url === `/markets/players/${mockPlayer.id}/buy` &&
          req.method === 'POST' &&
          req.body == null
        )
        .flush(mockResponse);
        const purchaseResponse = await promise;
        expect(purchaseResponse).toEqual(mockResponse)
    })
    it('should unauthorize purchase for non-existing club', async () => {
      const mockPlayer: Player = createPlayer();
      const promise = firstValueFrom(service.buyPlayer(mockPlayer.id));
      httpMock
        .expectOne(req =>
          req.url === `/markets/players/${mockPlayer.id}/buy` &&
          req.method === 'POST' &&
          req.body == null
        )
        .flush('Club not found', { statusText: 'Not Found', status: 404 });
      await expect(promise).rejects.toEqual(
        expect.objectContaining({ error: 'Club not found' })
      );
    });
    it('should unauthorize purchase for non-existing player', async () => {
      const mockPlayer: Player = createPlayer();
      const promise = firstValueFrom(service.buyPlayer(mockPlayer.id));
      httpMock
        .expectOne(req =>
          req.url === `/markets/players/${mockPlayer.id}/buy` &&
          req.method === 'POST' &&
          req.body == null
        )
        .flush('Player not found', { statusText: 'Not Found', status: 404 });
      await expect(promise).rejects.toEqual(
        expect.objectContaining({ error: 'Player not found' })
      );
    });
    it('should unauthorize purchase when club fund is insufficient', async () => {
      const mockPlayer: Player = createPlayer();
      const promise = firstValueFrom(service.buyPlayer(mockPlayer.id));
      httpMock
        .expectOne(req =>
          req.url === `/markets/players/${mockPlayer.id}/buy` &&
          req.method === 'POST' &&
          req.body == null
        )
        .flush('Insufficient funds', { statusText: 'Forbidden', status: 403 });
      await expect(promise).rejects.toEqual(
        expect.objectContaining({ error: 'Insufficient funds' })
      );
    });
  });
});
