import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { environment } from '../../../environments/environment';

import * as AuthActions from './auth.actions';
import * as fromAuthActions from './auth.actions';
import { User } from '../user.model';
import { AuthService } from '../auth.service';

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

const USER = 'user-fitness';

const handleAuthentication = (response: AuthResponseData): Action => {
  const expiresInMillis = +response.expiresIn * 1000;
  const expirationDate = new Date(new Date().getTime() + expiresInMillis);
  const user = new User(response.email, response.localId, response.idToken, expirationDate);
  sessionStorage.setItem(USER, JSON.stringify(user));

  return AuthActions.authenticateSuccess({
    email: response.email,
    userId: response.localId,
    token: response.idToken,
    expirationDate,
    redirect: true
  });
}

const handleError = (errorResponse: HttpErrorResponse): Observable<Action> => {
  let errorMessage = 'An Unknown error occurred!';
  if (!errorResponse.error || !errorResponse.error.error) {
    return of(AuthActions.authenticateFail({errorMessage}));
  }
  switch (errorResponse.error.error.message) {
    case 'EMAIL_EXISTS' :
      errorMessage = 'The email address is already in use by another account.';
      break;
    case 'OPERATION_NOT_ALLOWED':
      errorMessage = 'Password sign-in is disabled for this project.';
      break;
    case 'TOO_MANY_ATTEMPTS_TRY_LATER' :
      errorMessage = 'We have blocked all requests from this device due to ' +
        'unusual activity. Try again later.';
      break;
    case 'EMAIL_NOT_FOUND' :
      errorMessage = 'There is no user record corresponding to this identifier.' +
        ' The user may have been deleted.';
      break;
    case 'INVALID_PASSWORD':
      errorMessage = 'The password is invalid or the user does not have a password.';
      break;
    case 'USER_DISABLED' :
      errorMessage = 'The user account has been disabled by an administrator.';
      break;
  }
  return of(AuthActions.authenticateFail({errorMessage}));
}

@Injectable()
export class AuthEffects {
  static readonly API_KEY = environment.firebaseApiKey;

  authLogin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginStart),
      switchMap(actionData => {
        return this.http.post<AuthResponseData>(
          'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' +
          AuthEffects.API_KEY,
          {
            email: actionData.email,
            password: actionData.password,
            returnSecureToken: true
          }
        ).pipe(
          tap(this.setLogoutTimer.bind(this)),
          map(handleAuthentication),
          catchError(handleError)
        )
      })
    )
  );

  authSignUp$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.signUpStart),
      switchMap(actionData => {
        return this.http.post<AuthResponseData>(
          'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' +
          AuthEffects.API_KEY,
          {
            email: actionData.email,
            password: actionData.password,
            returnSecureToken: true
          }
        ).pipe(
          tap(this.setLogoutTimer.bind(this)),
          map(handleAuthentication),
          catchError(handleError)
        )
      })
    )
  );

  autoLogin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.autoLogin),
      map(() => {
        const user = sessionStorage.getItem(USER);
        if (!user) {
          // Return Dummy action
          return {type: 'DUMMY'};
        }

        const userData: {
          email: string,
          id: string,
          _token: string,
          _tokenExpirationDate: string
        } = JSON.parse(user);

        if (userData._token) {
          const expirationDuration =
            new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
          this.authService.setLogoutTimer(expirationDuration);

          return fromAuthActions.authenticateSuccess({
            email: userData.email,
            userId: userData.id,
            token: userData._token,
            expirationDate: new Date(userData._tokenExpirationDate),
            redirect: false
          });
        }

        // Return Dummy action
        return {type: 'DUMMY'};
      })
    )
  );

  authSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.authenticateSuccess),
      tap((actionData => {
          if (actionData.redirect) {
            this.router.navigate(['/']);
          }
        })
      )
    ), {dispatch: false}
  );

  authLogout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      tap(() => {
        this.authService.clearLogoutTimer();
        sessionStorage.removeItem(USER);
        this.router.navigate(['/auth']);
      })
    ), {dispatch: false}
  );

  constructor(private actions$: Actions,
              private http: HttpClient,
              private router: Router,
              private authService: AuthService) {
  }

  private setLogoutTimer(response: AuthResponseData) {
    this.authService.setLogoutTimer(+response.expiresIn * 1000);
  }
}
