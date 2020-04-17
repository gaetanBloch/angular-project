import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User } from './user.model';

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
  readonly apiKey = 'AIzaSyAO-uajGQqcQ1p8YkIDu_QEj6ZAWlx6tuo';
  user = new BehaviorSubject<User>(null);


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

  constructor(private http: HttpClient) {
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

  private handleAuthentication(response: AuthResponseData) {
    const expirationDate = new Date(new Date().getTime() + +response.expiresIn * 1000);
    const user = new User(response.email, response.localId, response.idToken, expirationDate);
    this.user.next(user);
  }
}
