import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromTraining from './training.reducer';

export const selectFeature =
  createFeatureSelector<fromTraining.TrainingState>('training');

export const selectActiveTrainingDtls = createSelector(
  selectFeature,
  (state: fromTraining.TrainingState) => state.activeTraining
);

export const selectIsTrainingDtls = createSelector(
  selectFeature,
  (state: fromTraining.TrainingState) => state.activeTraining !== null
);

export const selectAvailableTrainingsDtls = createSelector(
  selectFeature,
  (state: fromTraining.TrainingState) => state.availableExercises
);

export const selectFinishedTrainingsDtls = createSelector(
  selectFeature,
  (state: fromTraining.TrainingState) => state.finishedExercises
);
