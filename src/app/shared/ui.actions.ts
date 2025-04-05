import {createActionGroup, emptyProps, props} from '@ngrx/store';
import { Exercise } from '../training/exercise.model';

export const fetchexercises = createActionGroup({
  source: 'exercises',
  events: {
      'fetch': emptyProps(),
      'fetchSuccess': props<{ data: Exercise[] }>(),
      'fetchFailure': props<{ error: any }>(),
  }
});
