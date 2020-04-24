import { Action, createReducer, on } from '@ngrx/store';

import { User } from '../user.model';
import * as AuthActions from './auth.actions';

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
    initialState,
    on(AuthActions.loginStart, AuthActions.signUpStart, state => ({
      ...state,
      authError: null,
      loading: true
    })),
    on(AuthActions.authenticateSuccess, (state, action) => ({
      ...state,
      user: new User(action.email, action.userId, action.token, action.expirationDate),
      authError: null,
      loading: false
    })),
    on(AuthActions.authenticateFail, (state, action) => ({
      ...state,
      user: null,
      authError: action.errorMessage,
      loading: false
    })),
    on(AuthActions.clearError, state => ({
      ...state,
      authError: null
    })),
    on(AuthActions.logout, state => ({
      ...state,
      user: null
    }))
  )(authState, authAction);
}
