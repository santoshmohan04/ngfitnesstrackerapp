import { Action, createReducer, on } from '@ngrx/store';
import * as authActions from './auth.actions';

export interface State {
  isLoading: boolean;
  loggedInUser: any;
}

export const initialState: State = {
  isLoading: false,
  loggedInUser: sessionStorage.getItem('authUser')
    ? JSON.parse(sessionStorage.getItem('authUser'))
    : null,
};

export const authReducer = createReducer(
  initialState,
  on(authActions.authdata.login, (state) => ({ ...state, isLoading: true })),
  on(authActions.authdata.loginSuccess, (state, { data }) => ({
    ...state,
    isLoading: false,
    loggedInUser: data,
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
  on(authActions.authdata.signup, (state) => ({ ...state, isLoading: true })),
  on(authActions.authdata.signupSuccess, (state, { data }) => ({
    ...state,
    isLoading: false,
    loggedInUser: data,
  })),
  on(authActions.authdata.signupFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error: error,
  })),
  on(authActions.authdata.clear, () => ({ ...initialState }))
);

export function authreducer(state: State | undefined, action: Action) {
  return authReducer(state, action);
}
