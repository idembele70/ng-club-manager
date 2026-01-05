import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { HttpUtilities } from '../utilities/http.utilities';
import { LoginPayload, RegisterPayload } from './auth.model';
import { AuthRepositoryService } from './auth.repository';

export const authRepositoryInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.startsWith('/auth')) {
    return next(req);
  }
  const authRepository = inject(AuthRepositoryService);
  if (req.url.endsWith('/register')) {
    const { managerName, clubName, password } = req.body as RegisterPayload;
    if (!managerName || !clubName || !password) {
      return HttpUtilities.missingFieldsError(req.url, 'CREATE_CLUB_FORM.ERRORS.MISSING_MANDATORY_FIELDS');
    }
    return HttpUtilities.postReqSuccessResponse(req.url, authRepository.register(req.body as RegisterPayload));
  }

  if (req.url.endsWith('/login')) {
    const { managerOrClubName, password } = req.body as LoginPayload;
    if (!managerOrClubName || !password) {
      return HttpUtilities.missingFieldsError(req.url, 'LOGIN_CLUB_FORM.ERRORS.MISSING_MANDATORY_FIELDS');
    }

    const clubAuthSession = authRepository.login(req.body as LoginPayload);
    if (!clubAuthSession) {
      return HttpUtilities.notFoundError(req.url, 'LOGIN_CLUB_FORM.ERRORS.INVALID_CREDENTIALS');
    }
    return HttpUtilities.getReqSuccessResponse(req.url, clubAuthSession);
  }

  return HttpUtilities.notFoundError(req.url, 'ERRORS.HTTP.404.MESSAGE');
};