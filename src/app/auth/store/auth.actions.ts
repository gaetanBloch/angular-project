import { Action, createAction, props } from '@ngrx/store';

export const loginStart = createAction(
  '[Auth] Login Start',
  props<{ email: string, password: string }>()
);
export const signUpStart = createAction(
  '[Auth] Sign Up Start',
  props<{ email: string, password: string }>()
);
export const authenticateSuccess = createAction(
  '[Auth] Authenticate Success',
  props<{ email: string, userId: string, token: string, expirationDate: Date, redirect: boolean }>()
);
export const authenticateFail = createAction(
  '[Auth] Authenticate Fail',
  props<{ errorMessage: string }>()
);
export const clearError = createAction(
  '[Auth] Clear Error'
);
export const autoLogin = createAction(
  '[Auth] Auto Login'
);
export const logout = createAction(
  '[Auth] Logout'
);

export const LOGIN_START = '[Auth] Login Start';
export const SIGN_UP_START = '[Auth] Sign Up Start';
export const AUTHENTICATE_SUCCESS = '[Auth] Authenticate Success';
export const AUTHENTICATE_FAIL = '[Auth] Authenticate Fail';
export const CLEAR_ERROR = '[Auth] Clear Error';
export const AUTO_LOGIN = '[Auth] Auto Login';
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
    email: string, userId: string, token: string, expirationDate: Date, redirect: boolean
  }) {
  }
}

export class AuthenticateFail implements Action {
  readonly type = AUTHENTICATE_FAIL;

  constructor(public payload: string) {
  }
}

export class ClearError implements Action {
  readonly type = CLEAR_ERROR;
}

export class AutoLogin implements Action {
  readonly type = AUTO_LOGIN;
}

export class Logout implements Action {
  readonly type = LOGOUT;
}

export type AuthActions =
  LoginStart |
  AuthenticateSuccess |
  AuthenticateFail |
  SignUpStart |
  ClearError |
  AutoLogin |
  Logout;
