import { Action } from '@ngrx/store';

export const LOGIN_START = '[Auth] Login Start';
export const SIGN_UP_START = '[Auth] Sign Up Start';
export const AUTHENTICATE_SUCCESS = '[Auth] Authenticate Success';
export const AUTHENTICATE_FAIL = '[Auth] Authenticate Fail';
export const LOGOUT = '[Auth] Logout';

export class LoginStart implements Action {
  readonly type = LOGIN_START;

  constructor(public payload: { email: string, password: string }) {
  }
}

export class SignUpStart implements Action {
  readonly type = SIGN_UP_START;

  constructor(public payload: { email: string, password: string }) {
  }
}

export class AuthenticateSuccess implements Action {
  readonly type = AUTHENTICATE_SUCCESS;

  constructor(public payload: {
    email: string, userId: string, token: string, expirationDate: Date
  }) {
  }
}

export class AuthenticateFail implements Action {
  readonly type = AUTHENTICATE_FAIL;

  constructor(public payload: string) {
  }
}

export class Logout implements Action {
  readonly type = LOGOUT;
}

export type AuthActions =
  LoginStart |
  AuthenticateSuccess |
  AuthenticateFail |
  SignUpStart |
  Logout;
