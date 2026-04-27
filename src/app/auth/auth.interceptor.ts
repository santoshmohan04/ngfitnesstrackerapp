import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { TokenHelper } from '../shared/token.helper';
import { UiService } from '../shared/ui.service';

/**
 * HTTP Interceptor to add JWT token to all outgoing requests
 * and handle 401 unauthorized errors
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const uiService = inject(UiService);
  const token = TokenHelper.getToken();

  // Clone the request and add authorization header if token exists
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // Handle the request and catch errors
  return next(req).pipe(
    catchError((error) => {
      if (error.status === 401) {
        // Clear token and redirect to login
        TokenHelper.removeToken();
        router.navigate(['/login']);
      } else if (error.status === 0) {
        uiService.showError('Network error. Please check your connection.');
      } else if (error.status >= 500) {
        uiService.showError('Server error. Please try again.');
      }
      return throwError(() => error);
    })
  );
};
