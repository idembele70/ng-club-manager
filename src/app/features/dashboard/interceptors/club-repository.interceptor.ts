import { HttpUtilities } from '@/core/utilities/http.utilities';
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ClubRepositoryService } from '../repositories/club.repository';

export const clubRepositoryInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.startsWith('/clubs')) {
    return next(req);
  }
  const clubRepository = inject(ClubRepositoryService);
  if (req.url.endsWith('me')) {
    const token = req.headers.get('token')?.split(' ')[1] ?? '';

    const response = clubRepository.findByToken(token);
    if (response === 'NOT_FOUND') {
      return HttpUtilities.notFoundError(req.url, 'RESTORE_SESSION.ERRORS.FAILED');
    }
    if (response === 'TOKEN_EXPIRED') {
      return HttpUtilities.unauthorizedError(req.url, 'RESTORE_SESSION.ERRORS.TOKEN_EXPIRED');
    }
    return HttpUtilities.getReqSuccessResponse(req.url, response);
  }

  if (req.url.includes('/search') && req.params.get('name')) {
    const name = req.params.get('name');
    const club = clubRepository.findByName(name!);
    return HttpUtilities.getReqSuccessResponse(req.url, club);
  }
  return HttpUtilities.notFoundError(req.url, 'ERRORS.HTTP.404.MESSAGE');
};
