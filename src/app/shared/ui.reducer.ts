import { Action, createReducer, on } from '@ngrx/store';
import * as uiActions from './ui.actions';
import * as trainingActions from '../training/training.actions';
import { Exercise } from '../training/exercise.model';
import * as authActions from '../auth/auth.actions';

export interface State {
  isLoading : boolean;
  exercises: Exercise[];
  error:any;
}

export const initialState : State= {
  isLoading : false,
  exercises: [],
  error:null
};

export const uiReducer = createReducer(
  initialState,
  on(uiActions.fetchexercises.fetch, (state) => ({ ...state, isLoading: true })),
  on(trainingActions.trainingsdata.getavailabletrainings, (state) => ({ ...state, isLoading: true })),
  on(uiActions.fetchexercises.fetchSuccess, (state, {data}) => ({ ...state, isLoading: false, exercises:data })),
  on(uiActions.fetchexercises.fetchFailure, (state, {error}) => ({ ...state, isLoading: false, error: error})),
  on(trainingActions.trainingsdata.setavailabletrainings, (state) => ({ ...state, isLoading: false })),
  on(authActions.authdata.clear, () => ({ ...initialState }))
)


export function uireducer(state: State | undefined, action: Action) {
  return uiReducer(state, action);
}
