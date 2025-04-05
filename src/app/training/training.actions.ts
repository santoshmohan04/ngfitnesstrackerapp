import {createActionGroup, emptyProps, props} from '@ngrx/store';
import {Exercise} from './exercise.model';

export const trainingsdata = createActionGroup({
  source: 'training',
  events: {
      'getavailabletrainings': emptyProps(),
      'setavailabletrainings': props<{ data: Exercise[] }>(),
      'setfinishedtrainings': props<{ data: Exercise[] }>(),
      'starttraining': props<{ data: string }>(),
      'stoptraining': emptyProps(),
      'completeexercise': props<{ data: Exercise }>(),
      'cancelexercise': props<{ data: Exercise, progress: number }>(),
  }
});

