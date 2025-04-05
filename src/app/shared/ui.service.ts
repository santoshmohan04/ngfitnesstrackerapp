import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { Auth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class UiService {
  private readonly loadingStateSubject = new BehaviorSubject<boolean>(false);
  loadingStateChanged$: Observable<boolean> =
    this.loadingStateSubject.asObservable();
  router = inject(Router);
  auth = inject(Auth);
  constructor(private readonly snackbar: MatSnackBar) {}

  setLoadingState(isLoading: boolean) {
    this.loadingStateSubject.next(isLoading);
  }

  showSnackbar(message: string, action: string | null, duration: number) {
    this.snackbar.open(message, action, { duration });
  }

  logout() {
    this.auth
      .signOut()
      .then(() => {
        try {
          sessionStorage.clear();
        } catch (e) {
          console.error('Error clearing sessionStorage:', e);
          // Consider showing a user-friendly message
        }
        this.router.navigate(['/login']);
      })
      .catch((error) => {
        console.error('Logout failed:', error);
        // Display a user-friendly error message (e.g., using a toast or snackbar)
      });
  }
}
