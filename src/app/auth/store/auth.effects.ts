import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { environment } from '../../../environments/environment';

import * as AuthActions from './auth.actions';

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable()
export class AuthEffects {
  static readonly API_KEY = environment.firebaseApiKey;

  @Effect()
  authSignUp = this.actions$.pipe(
    ofType(AuthActions.SIGN_UP_START),
    switchMap((authData: AuthActions.SignUpStart) => {
      return this.http.post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' +
        AuthEffects.API_KEY,
        {
          email: authData.payload.email,
          password: authData.payload.password,
          returnSecureToken: true
        }
      )
    })
  );

  @Effect()
  authLogin = this.actions$.pipe(
    ofType(AuthActions.LOGIN_START),
    switchMap((authData: AuthActions.LoginStart) => {
      return this.http.post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' +
        AuthEffects.API_KEY,
        {
          email: authData.payload.email,
          password: authData.payload.password,
          returnSecureToken: true
        }
      ).pipe(
        map(response => {
          // must return an Action
          const expiresInMillis = +response.expiresIn * 1000;
          const expirationDate = new Date(new Date().getTime() + expiresInMillis);
          return new AuthActions.AuthenticateSuccess({
            email: response.email,
            userId: response.localId,
            token: response.idToken,
            expirationDate
          })
        }),
        catchError(errorResponse => {
          // must return an Observable of Action
          let errorMessage = 'An Unknown error occurred!';
          if (!errorResponse.error || !errorResponse.error.error) {
            return of(new AuthActions.AuthenticateFail(errorMessage));
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
          return of(new AuthActions.AuthenticateFail(errorMessage));
        })
      )
    })
  );

  @Effect({dispatch: false})
  authSuccess = this.actions$.pipe(
    ofType(AuthActions.AUTHENTICATE_SUCCESS),
    tap(() => {
      this.router.navigate(['/']);
    })
  )

  constructor(private actions$: Actions, private http: HttpClient, private router: Router) {
  }
}
