import { Action } from '@ngrx/store';

export const LOGIN = 'LOGIN';

export class Login implements Action {
  readonly type = LOGIN;

  constructor(public payload: {
    email: string, userId: string, token: string, expirationDate: Date
  }) {
  }
}
