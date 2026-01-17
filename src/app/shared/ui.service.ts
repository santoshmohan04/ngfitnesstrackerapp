import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { TokenHelper } from './token.helper';

@Injectable({
  providedIn: 'root',
})
export class UiService {
  private readonly loadingStateSubject = new BehaviorSubject<boolean>(false);
  loadingStateChanged$: Observable<boolean> =
    this.loadingStateSubject.asObservable();
  router = inject(Router);
  
  constructor(private readonly snackbar: MatSnackBar) {}

  setLoadingState(isLoading: boolean) {
    this.loadingStateSubject.next(isLoading);
  }

  showSnackbar(message: string, action: string | null, duration: number) {
    this.snackbar.open(message, action, { duration });
  }

  logout() {
    try {
      TokenHelper.removeToken();
      sessionStorage.clear();
      this.router.navigate(['/login']);
    } catch (e) {
      console.error('Error during logout:', e);
      this.showSnackbar('Logout failed. Please try again.', null, 3000);
    }
  }
}
