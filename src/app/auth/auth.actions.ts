import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { User } from './user.model';

export const authdata = createActionGroup({
  source: 'auth',
  events: {
    login: props<{ email: string; password: string }>(),
    loginSuccess: props<{ token: string; user: User }>(),
    loginFailure: props<{ error: any }>(),
    signup: props<{ email: string; password: string; firstName: string; lastName: string }>(),
    signupSuccess: props<{ token: string; user: User }>(),
    signupFailure: props<{ error: any }>(),
    setLoading: props<{ data: boolean }>(),
    logout: emptyProps(),
    clear: emptyProps(),
  },
});
