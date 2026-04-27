import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { TokenHelper } from '../shared/token.helper';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);

  // Check if token exists and is not expired
  if (TokenHelper.hasToken() && !TokenHelper.isTokenExpired()) {
    return true; // User is authenticated, allow access
  } else {
    // No valid token, redirect to login
    return router.createUrlTree(['/login']);
  }
};

