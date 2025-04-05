import {ActionReducerMap} from '@ngrx/store';

import * as fromUi from './shared/ui.reducer';
import * as fromAuth from  './auth/auth.reducer';
import * as fromTrainings from './training/training.reducer';

export interface State {
  ui : fromUi.State;
  auth : fromAuth.State;
  training: fromTrainings.TrainingState
}

export const reducers : ActionReducerMap<State> = {
  ui : fromUi.uireducer,
  auth : fromAuth.authreducer,
  training: fromTrainings.trainingreducer
}

