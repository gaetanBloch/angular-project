import { User } from '../user.model';

export interface State {
  user: User;
}

const initialState: State = {
  user: null
};

export function authReducer(state: State = initialState, action) {
  return state;
}
