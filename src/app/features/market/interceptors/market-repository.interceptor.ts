import { AuthRepositoryService } from '@/core/auth/auth.repository';
import { HttpUtilities } from '@/core/utilities/http.utilities';
import { ClubRepositoryService } from '@/features/dashboard/repositories/club.repository';
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { MarketRepository } from '../repositories/market.repository';
import { PlayerRepository } from '../repositories/player.repository';

export const marketRepositoryInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.startsWith('/markets')) {
    return next(req);
  }

  const marketRepository = inject(MarketRepository);
  const authRepository = inject(AuthRepositoryService);
  const clubRepository = inject(ClubRepositoryService);
  const playerRepository = inject(PlayerRepository);
  const token = req.headers.get('Authorization')?.split(' ')[1];

  if (!authRepository.isTokenValid(token)) {
    return HttpUtilities.unauthorizedError(req.url, 'ERRORS.HTTP.401.MESSAGE')
  }
  if (req.url.endsWith('/players')) {
    return HttpUtilities.getReqSuccessResponse(req.url, marketRepository.getPlayersForSale(req.params));
  }
  if (/players\/[a-zA-Z0-9-]+\/buy$/.test(req.url)) {
    const decode = authRepository.decodeToken(token ?? '');
    const playerId = req.url.split('/').at(3);

    const club = clubRepository.findById(decode.clubId);

    if (!club) {
      return HttpUtilities.notFoundError(req.url, 'MARKET.ERRORS.CLUB.NOT_FOUND');
    }

    const player = playerRepository.findById(playerId!);
    if (!player) {
      return HttpUtilities.notFoundError(req.url, 'MARKET.ERRORS.PLAYER.NOT_FOUND');
    }

    if (club.balance < player.price) {
      return HttpUtilities.forbiddenError(req.url, 'MARKET.ERRORS.INSUFFICIENT_FUNDS');
    }

    playerRepository.update({...player, clubId: club.id });
    clubRepository.update({...club });
    const response = marketRepository.buyPlayer(player, club.id);

    return HttpUtilities.postReqSuccessResponse(req.url, response);
  }

  return HttpUtilities.notFoundError(req.url);
};
