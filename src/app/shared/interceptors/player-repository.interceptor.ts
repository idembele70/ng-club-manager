import { AuthRepositoryService } from '@/core/auth/auth.repository';
import { HttpUtilities } from '@/core/utilities/http.utilities';
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { PlayerRepository } from '../repositories/player.repository';

export const playerRepositoryInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.startsWith('/players')) {
    return next(req);
  }

  const authRepository = inject(AuthRepositoryService);
  const playerRepository = inject(PlayerRepository);
  const token = req.headers.get('Authorization')?.split(' ')[1];

  if (!authRepository.isTokenValid(token)) {
    return HttpUtilities.unauthorizedError(req.url, 'ERRORS.HTTP.401.MESSAGE')
  }

  if (req.method === 'GET') {
    const params = req.params.keys().reduce<Record<string, string>>(
      (acc, key) => {
        const value = req.params.get(key);
        if (value !== null) acc[key] = value;
        return acc;
      },
      {}
    );
    const players = playerRepository.find(params)
    return HttpUtilities.getReqSuccessResponse(req.url, {players: players, playersCount: players.length});
  }

  return HttpUtilities.notFoundError(req.url);

};
