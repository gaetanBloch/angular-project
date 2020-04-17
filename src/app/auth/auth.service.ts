import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
}

@Injectable({providedIn: 'root'})
export class AuthService {
  constructor(private http: HttpClient) {
  }

  signUp(email: string, password: string): Observable<AuthResponseData> {
    return this.http.post<AuthResponseData>(
      'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=\n' +
      'AIzaSyAO-uajGQqcQ1p8YkIDu_QEj6ZAWlx6tuo',
      {email, password, returnSecureToken: true}
    ).pipe(
      catchError(errorRes => {
        let errorMessage = 'An Unknown error occurred!';

        if (!errorRes.error || !errorRes.error.error) {
          return throwError(errorMessage);
        }

        switch (errorRes.error.error.message) {
          case 'EMAIL_EXISTS' :
            errorMessage = 'The email address is already in use by another account';
            break;
          case 'OPERATION_NOT_ALLOWED':
            errorMessage = 'Password sign-in is disabled for this project';
            break;
          case 'TOO_MANY_ATTEMPTS_TRY_LATER' :
            errorMessage = 'We have blocked all requests from this device due to ' +
              'unusual activity. Try again later';
            break;
        }
        return throwError(errorMessage);
      })
    );
  }
}
