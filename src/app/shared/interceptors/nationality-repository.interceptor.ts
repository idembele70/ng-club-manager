import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { NationalityRepository } from '../repositories/nationality.repository';
import { HttpUtilities } from '@/core/utilities/http.utilities';

export const nationalityRepositoryInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.startsWith('/nationalities'))
    return next(req);

  const nationalityRepository = inject(NationalityRepository);

  if (req.method === 'GET') {
    return HttpUtilities.getReqSuccessResponse(req.url, nationalityRepository.find({}))
  }

  return HttpUtilities.notFoundError(req.url);
};
