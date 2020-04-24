import { User } from '../user.model';

import * as AuthActions from './auth.actions';
import { Action, createReducer } from '@ngrx/store';

export interface State {
  user: User;
  authError: string;
  loading: boolean;
}

const initialState: State = {
  user: null,
  authError: null,
  loading: false
};

export function authReducer(authState: State | undefined, authAction: Action) {
  return createReducer(
    initialState
  )(authState, authAction);
}

export function authReducerOld(state: State = initialState, action: AuthActions.AuthActions) {
  switch (action.type) {
    case AuthActions.LOGIN_START:
    case AuthActions.SIGN_UP_START:
      return {
        ...state,
        authError: null,
        loading: true
      };
    case AuthActions.AUTHENTICATE_SUCCESS:
      const user = new User(
        action.payload.email,
        action.payload.userId,
        action.payload.token,
        action.payload.expirationDate
      );
      return {
        ...state,
        user,
        authError: null,
        loading: false
      };
    case AuthActions.AUTHENTICATE_FAIL:
      return {
        ...state,
        user: null,
        authError: action.payload,
        loading: false
      };
    case AuthActions.CLEAR_ERROR:
      return {
        ...state,
        authError: null
      };
    case AuthActions.LOGOUT:
      return {
        ...state,
        user: null
      };
    default:
      return state;
  }
}
