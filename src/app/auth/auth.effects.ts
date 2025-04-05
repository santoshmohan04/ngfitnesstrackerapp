import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { from, of } from 'rxjs';
import { map, exhaustMap, catchError, tap, delay } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { UiService } from '../shared/ui.service';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { authdata } from './auth.actions';
import { Router } from '@angular/router';

@Injectable()
export class AuthEffects {
  actions$ = inject(Actions);
  store = inject(Store);
  uiService = inject(UiService);
  auth = inject(Auth);
  router = inject(Router);

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authdata.login),
      exhaustMap((action) =>
        from(signInWithEmailAndPassword(this.auth, action.email, action.password)).pipe(
          map((result) => {
            sessionStorage.setItem('authUser', JSON.stringify(result));
            return authdata.loginSuccess({ data: result });
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
      tap(() => this.router.navigate(['/training']))
    );
  }, { dispatch: false });  

  registerUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authdata.signup),
      exhaustMap((action) =>
        from(createUserWithEmailAndPassword(this.auth, action.email, action.password)).pipe(
          map((result) => {
            sessionStorage.setItem('authUser', JSON.stringify(result));
            return authdata.signupSuccess({ data: result });
          }),
          catchError((error) => {
            this.uiService.showSnackbar(error.message, null, 3000);
            return of(authdata.signupFailure({ error }));
          })
        )
      )
    )
  );

  logoutUser$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(authdata.logout),
        tap(() => {
          this.uiService.logout();
        })
      );
    },
    { dispatch: false }
  );

}
