import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { JwtService } from '../services/jwt.service';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(JwtService).getToken();
  if (!token)
    return next(req);

  const reqClone = req.clone({
    setHeaders: {
      token: `bearer ${token}`,
    }
  });
  return next(reqClone);
};
