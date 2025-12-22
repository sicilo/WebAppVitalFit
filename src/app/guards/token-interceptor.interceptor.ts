import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  // Obtener el token directamente de localStorage para evitar dependencia circular
  let authToken: string | null = null;

  if (isPlatformBrowser(platformId)) {
    authToken = localStorage.getItem('token');
  }

  const authReq = req.clone({
    headers: req.headers
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${authToken || ''}`),
  });

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        console.log('Unauthorized access, redirecting to login');
        router.navigate(['/']);
        return throwError(() => new Error('Unauthorized access'));
      }
      console.error('HTTP error', error);
      return throwError(() => new Error(`${error.status} - ${error.message}`));
    })
  );

};
