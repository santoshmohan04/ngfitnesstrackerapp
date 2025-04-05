import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromAuth from './auth.reducer';

export const selectFeature = createFeatureSelector<fromAuth.State>('auth');

export const selectUserDtls = createSelector(
  selectFeature,
  (state: fromAuth.State) => state.loggedInUser
);

export const selectLoadingDtls = createSelector(
  selectFeature,
  (state: fromAuth.State) => state.isLoading
);
