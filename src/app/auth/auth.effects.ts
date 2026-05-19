import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, exhaustMap, catchError, tap, delay } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { UiService } from '../shared/ui.service';
import { AuthService } from './auth.service';
import { authdata } from './auth.actions';
import { Router } from '@angular/router';

@Injectable()
export class AuthEffects {
  actions$ = inject(Actions);
  store = inject(Store);
  uiService = inject(UiService);
  authService = inject(AuthService);
  router = inject(Router);

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authdata.login),
      exhaustMap((action) =>
        this.authService.login({ email: action.email, password: action.password }).pipe(
          map((response) => {
            return authdata.loginSuccess({ 
              token: response.access_token,
              user: {
                userId: response.user.id,
                email: response.user.email,
                firstName: response.user.firstName,
                lastName: response.user.lastName
              }
            });
          }),
          catchError((error) => {
            this.uiService.showSnackbar(error.message, null, 3000);
            return of(authdata.loginFailure({ error }));
          })
        )
      )
    )
  );

  onLoginSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(authdata.loginSuccess),
      delay(500),
      tap(() => {
        const currentUrl = this.router.url;
        if (currentUrl === '/login' || currentUrl === '/') {
          this.router.navigate(['/dashboard']);
        }
      })
    );
  }, { dispatch: false });

  registerUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authdata.signup),
      exhaustMap((action) =>
        this.authService.register({ 
          email: action.email, 
          password: action.password,
          firstName: action.firstName,
          lastName: action.lastName
        }).pipe(
          map((response) => {
            return authdata.signupSuccess({ 
              token: response.access_token,
              user: {
                userId: response.user.id,
                email: response.user.email,
                firstName: response.user.firstName,
                lastName: response.user.lastName
              }
            });
          }),
          catchError((error) => {
            this.uiService.showSnackbar(error.message, null, 3000);
            return of(authdata.signupFailure({ error }));
          })
        )
      )
    )
  );

  onSignupSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(authdata.signupSuccess),
      delay(500),
      tap(() => {
        const currentUrl = this.router.url;
        if (currentUrl === '/signup' || currentUrl === '/') {
          this.router.navigate(['/dashboard']);
        }
      })
    );
  }, { dispatch: false });

  logoutUser$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(authdata.logout),
        tap(() => {
          this.authService.logout().subscribe();
          this.uiService.logout();
        })
      );
    },
    { dispatch: false }
  );

}
