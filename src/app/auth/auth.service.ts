import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { User } from './user.model';
import { environment } from '../../environments/environment';
import * as fromApp from '../store/app.reducer';
import * as fromAuthActions from '../auth/store/auth.actions';

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({providedIn: 'root'})
export class AuthService {
  readonly apiKey = environment.firebaseApiKey;
  tokenExpirationTimeout: any;

  private static handleError(errorResponse: HttpErrorResponse) {
    let errorMessage = 'An Unknown error occurred!';
    if (!errorResponse.error || !errorResponse.error.error) {
      return throwError(errorMessage);
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
    return throwError(errorMessage);
  }

  constructor(private http: HttpClient,
              private router: Router,
              private store: Store<fromApp.AppState>) {
  }

  signUp(email: string, password: string): Observable<AuthResponseData> {
    return this.http.post<AuthResponseData>(
      'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + this.apiKey,
      {email, password, returnSecureToken: true}
    ).pipe(catchError(AuthService.handleError), tap(this.handleAuthentication.bind(this)));
  }

  login(email: string, password: string): Observable<AuthResponseData> {
    return this.http.post<AuthResponseData>(
      'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + this.apiKey,
      {email, password, returnSecureToken: true}
    ).pipe(catchError(AuthService.handleError), tap(this.handleAuthentication.bind(this)));
  }

  autoLogin(): void {
    const user = localStorage.getItem('user');
    if (!user) {
      return;
    }

    const userData: {
      email: string,
      id: string,
      _token: string,
      _tokenExpirationDate: string
    } = JSON.parse(user);

    if (userData._token) {
      this.store.dispatch(new fromAuthActions.Login({
        email: userData.email,
        userId: userData.id,
        token: userData._token,
        expirationDate: new Date(userData._tokenExpirationDate)
      }));

      const expirationDuration =
        new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
      this.autoLogout(expirationDuration);
    }
  }

  logout(): void {
    this.store.dispatch(new fromAuthActions.Logout());
    this.router.navigate(['/auth']);
    localStorage.removeItem('user');
    if (this.tokenExpirationTimeout) {
      clearTimeout(this.tokenExpirationTimeout);
    }
    this.tokenExpirationTimeout = null;
  }

  autoLogout(expirationDuration: number): void {
    console.log(`User login expires in: ${expirationDuration} ms`);
    this.tokenExpirationTimeout = setTimeout(() => this.logout(), expirationDuration);
  }

  private handleAuthentication(response: AuthResponseData) {
    const expiresInMillis = +response.expiresIn * 1000;
    const expirationDate = new Date(new Date().getTime() + expiresInMillis);
    const user = new User(response.email, response.localId, response.idToken, expirationDate);
    this.store.dispatch(new fromAuthActions.Login({
      email: response.email,
      userId: response.localId,
      token: response.idToken,
      expirationDate
    }));
    this.autoLogout(expiresInMillis);
    localStorage.setItem('user', JSON.stringify(user));
  }
}
