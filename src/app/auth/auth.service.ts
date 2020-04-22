import { Injectable } from '@angular/core';

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
  tokenExpirationTimeout: any;

  constructor() {
  }

  logout(): void {
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
}
