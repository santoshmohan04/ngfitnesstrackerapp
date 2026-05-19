import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { TokenHelper } from '../shared/token.helper';
import { Store } from '@ngrx/store';
import { authdata } from './auth.actions';

// Request/Response Interfaces
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
}

export interface CurrentUserResponse {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private store: Store) {}

  /**
   * Called during application bootstrap to restore user session.
   */
  hydrateAuthState(): Observable<any> {
    // 1. Check if token exists and is valid
    if (!this.isAuthenticated()) {
      TokenHelper.removeToken();
      return of(null);
    }

    // 2. Fetch the user profile to re-hydrate the NgRx store
    return this.getCurrentUser().pipe(
      tap((response) => {
        // Handle both `{ user: {...} }` and `{ id: ... }` response structures defensively
        const userData = response.user ? response.user : (response as any);

        // Dispatch the strongly-typed action from the authdata action group
        this.store.dispatch(authdata.loginSuccess({ 
          token: '', // Token is securely managed by TokenHelper, passing empty string to satisfy props
          user: {
            userId: userData.id,
            email: userData.email,
            firstName: userData.firstName,
            lastName: userData.lastName
          } as any 
        }));
      }),
      catchError(() => {
        // If the token is invalid or the server rejects it, clean up
        TokenHelper.removeToken();
        return of(null);
      })
    );
  }

  /**
   * Login user with email and password
   */
  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, credentials).pipe(
      tap((response) => {
        TokenHelper.setToken(response.access_token);
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Register new user
   */
  register(userData: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/register`, userData).pipe(
      tap((response) => {
        TokenHelper.setToken(response.access_token);
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Get current authenticated user
   */
  getCurrentUser(): Observable<CurrentUserResponse> {
    return this.http.get<CurrentUserResponse>(`${this.apiUrl}/auth/me`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Logout user
   */
  logout(): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/auth/logout`, {}).pipe(
      tap(() => {
        TokenHelper.removeToken();
      }),
      catchError((error) => {
        // Even if logout fails on server, clear local token
        TokenHelper.removeToken();
        return throwError(() => error);
      })
    );
  }

  /**
   * Send forgot password email
   */
  forgotPassword(email: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/auth/forgot-password`, { email }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return TokenHelper.hasToken() && !TokenHelper.isTokenExpired();
  }

  /**
   * Handle HTTP errors
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      if (error.status === 401) {
        errorMessage = 'Invalid credentials';
      } else if (error.status === 409) {
        errorMessage = 'User already exists';
      } else if (error.error?.message) {
        if (Array.isArray(error.error.message)) {
          errorMessage = error.error.message.join(', ');
        } else {
          errorMessage = error.error.message;
        }
      } else {
        errorMessage = `Error: ${error.status}`;
      }
    }

    return throwError(() => new Error(errorMessage));
  }
}
