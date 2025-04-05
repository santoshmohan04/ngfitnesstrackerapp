import {trainingsdata} from './training.actions';
import {Exercise} from './exercise.model';
import {Action, createReducer, on} from '@ngrx/store';
import * as authActions from '../auth/auth.actions';

export interface TrainingState {
  availableExercises: Exercise[];
  finishedExercises: Exercise[];
  activeTraining: Exercise;
  error:any;
}

export const initialState: TrainingState = {
  availableExercises: [],
  finishedExercises: [],
  activeTraining: null,
  error:null
};

export const trainingReducer = createReducer(
  initialState,
  on(trainingsdata.setavailabletrainings, (state, {data}) => ({ ...state, availableExercises: data })),
  on(trainingsdata.setfinishedtrainings, (state, {data}) => ({ ...state, finishedExercises:data })),
  on(trainingsdata.starttraining, (state, {data}) => ({ ...state, activeTraining : {...state.availableExercises.find(ex => ex.id === data)}})),
  on(trainingsdata.stoptraining, (state) => ({ ...state, activeTraining:null })),
  on(authActions.authdata.clear, () => ({ ...initialState }))
)

export function trainingreducer(state: TrainingState | undefined, action: Action) {
  return trainingReducer(state, action);
}
