import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const authdata = createActionGroup({
  source: 'auth',
  events: {
    login: props<{ email: string; password: string }>(),
    loginSuccess: props<{ data: any }>(),
    loginFailure: props<{ error: any }>(),
    signup: props<{ email: string; password: string }>(),
    signupSuccess: props<{ data: any }>(),
    signupFailure: props<{ error: any }>(),
    setLoading: props<{ data: boolean }>(),
    logout: emptyProps(),
    clear: emptyProps(),
  },
});
