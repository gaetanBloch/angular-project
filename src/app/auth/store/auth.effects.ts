import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
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
          return of(new AuthActions.Login({
            email: response.email,
            userId: response.localId,
            token: response.idToken,
            expirationDate
          }))
        }),
        catchError(error => {
          // must not return an erroneous Observable
          return of()
        })
      )
    })
  );

  constructor(private actions$: Actions, private http: HttpClient) {
  }
}
