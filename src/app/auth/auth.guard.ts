import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const auth = getAuth();

  return new Observable<boolean | ReturnType<Router['createUrlTree']>>((observer) => {
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      if (user) {
        observer.next(true); // User is authenticated, allow access
      } else {
        observer.next(router.createUrlTree(['/login'])); // Redirect to login
      }
      observer.complete(); // Complete the Observable after emitting once
    });

    // Cleanup function: unsubscribe from onAuthStateChanged when the Observable is unsubscribed.
    return () => unsubscribe();
  }).pipe(
    map(result => result) //redundant, kept for consistency
  );
};

