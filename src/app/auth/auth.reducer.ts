import { Action, createReducer, on } from '@ngrx/store';
import { User } from './user.model';
import * as authActions from './auth.actions';

export interface State {
  isLoading: boolean;
  loggedInUser: User | null;
  token: string | null;
  error: any;
}

export const initialState: State = {
  isLoading: false,
  loggedInUser: null,
  token: null,
  error: null,
};

export const authReducer = createReducer(
  initialState,
  on(authActions.authdata.login, (state) => ({ 
    ...state, 
    isLoading: true,
    error: null 
  })),
  on(authActions.authdata.loginSuccess, (state, { token, user }) => ({
    ...state,
    isLoading: false,
    loggedInUser: user,
    token: token,
    error: null,
  })),
  on(authActions.authdata.loginFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error: error,
  })),
  on(authActions.authdata.setLoading, (state, { data }) => ({
    ...state,
    isLoading: data,
  })),
  on(authActions.authdata.signup, (state) => ({ 
    ...state, 
    isLoading: true,
    error: null 
  })),
  on(authActions.authdata.signupSuccess, (state, { token, user }) => ({
    ...state,
    isLoading: false,
    loggedInUser: user,
    token: token,
    error: null,
  })),
  on(authActions.authdata.signupFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error: error,
  })),
  on(authActions.authdata.logout, () => ({ ...initialState })),
  on(authActions.authdata.clear, () => ({ ...initialState }))
);

export function authreducer(state: State | undefined, action: Action) {
  return authReducer(state, action);
}
