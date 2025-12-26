import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ClubLoginPayload, CreateClubPayload } from '../models/club.model';
import { ClubRepositoryService } from '../repositories/club.repository';
import { HttpUtilities } from '../utilities/http.utilities';

export const clubRepositoryInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.startsWith('/clubs')) {
    return next(req);
  }
  const clubRepository = inject(ClubRepositoryService);

  if (req.url.endsWith('me')) {
    const token = req.headers.get('token')?.split(' ')[1] ?? '';

    const clubAuthSession = clubRepository.findByToken(token);
    if (!clubAuthSession) {
      return HttpUtilities.notFoundError(req.url, 'RESTORE_SESSION.ERRORS.FAILED');
    }
    if (+clubAuthSession.token < Date.now()) {
      return HttpUtilities.unauthorizedError(req.url, 'RESTORE_SESSION.ERRORS.TOKEN_EXPIRED');
    }
    return HttpUtilities.getReqSuccessResponse(req.url, clubAuthSession);
  }

  if (req.url.endsWith('/auth/register')) {
    const { managerName, clubName, password } = req.body as CreateClubPayload;
    if (!managerName || !clubName || !password) {
      return HttpUtilities.missingFieldsError(req.url, 'CREATE_CLUB_FORM.ERRORS.MISSING_MANDATORY_FIELDS');
    }
    return HttpUtilities.postReqSuccessResponse(req.url, clubRepository.create(req.body as CreateClubPayload));
  }

  if (req.url.endsWith('/auth/login')) {
    const { managerOrClubName, password } = req.body as ClubLoginPayload;
    if (!managerOrClubName || !password) {
      return HttpUtilities.missingFieldsError(req.url, 'LOGIN_CLUB_FORM.ERRORS.MISSING_MANDATORY_FIELDS');
    }

    const clubAuthSession = clubRepository.login(req.body as ClubLoginPayload);
    if (!clubAuthSession) {
      return HttpUtilities.notFoundError(req.url, 'LOGIN_CLUB_FORM.ERRORS.INVALID_CREDENTIALS');
    }
    return HttpUtilities.getReqSuccessResponse(req.url, clubAuthSession);
  }

  if (req.url.includes('/search') && req.params.get('name')) {
    const name = req.params.get('name');
    const club = clubRepository.findByName(name!);
    return HttpUtilities.getReqSuccessResponse(req.url, club);
  }
  return HttpUtilities.notFoundError(req.url, 'ERRORS.HTTP.404.MESSAGE');
};
