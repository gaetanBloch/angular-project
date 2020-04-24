import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromApp from '../store/app.reducer';
import * as AuthActions from '../auth/store/auth.actions';

@Injectable({providedIn: 'root'})
export class AuthService {
  tokenExpirationTimeout = null;

  constructor(private store: Store<fromApp.AppState>) {
  }

  setLogoutTimer(expirationDuration: number): void {
    console.log(`User login expires in: ${expirationDuration} ms`);
    this.tokenExpirationTimeout = setTimeout(() => {
      this.store.dispatch(AuthActions.logout());
    }, expirationDuration);
  }

  clearLogoutTimer(): void {
    if (this.tokenExpirationTimeout) {
      clearTimeout(this.tokenExpirationTimeout);
      this.tokenExpirationTimeout = null;
    }
  }
}
