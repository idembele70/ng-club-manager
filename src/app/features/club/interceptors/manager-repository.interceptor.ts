import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ManagerRepositoryService } from '../repositories/manager.repository';
import { HttpUtilities } from '../utilities/http.utilities';

export const managerRepositoryInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.startsWith('/manager')) {
    return next(req);
  }
  const managerRepository = inject(ManagerRepositoryService);

  if (req.url.includes('search') && req.params.get('name')) {
    const name = req.params.get('name')!;
    const manager = managerRepository.findByName(name);
    return HttpUtilities.getReqSuccessResponse(req.url, manager);
  }
  return HttpUtilities.notFoundError(req.url, 'ERRORS.HTTP.404.MESSAGE');
};
