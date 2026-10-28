import type { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const token = inject(AuthService).getSession()?.token;

  if (token === undefined) {
    return next(request);
  }

  return next(request.clone({ headers: request.headers.set('Authorization', `Bearer ${token}`) }));
};
