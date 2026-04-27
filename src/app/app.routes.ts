import { Routes } from '@angular/router';
import { WelcomeComponent } from './welcome/welcome.component';
import { authGuard } from './auth/auth.guard';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';

export const routes: Routes = [
  { path: '', component: WelcomeComponent },
  {path : 'signup', component : SignupComponent},
  {path : 'login', component : LoginComponent},
  {
    path: 'training',
    loadComponent: () =>
      import('./training/training.component').then(
        (file) => file.TrainingComponent
      ),
    canActivate: [authGuard],
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./dashboard/dashboard.component').then(f => f.DashboardComponent),
    canActivate: [authGuard],
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./profile/profile.component').then(f => f.ProfileComponent),
    canActivate: [authGuard],
  },
  {
    path: 'workout-plans',
    loadComponent: () =>
      import('./workout-plans/workout-plans.component').then(f => f.WorkoutPlansComponent),
    canActivate: [authGuard],
  },
  {
    path: 'forgot-password',
    loadComponent: () =>
      import('./auth/forgot-password/forgot-password.component').then(f => f.ForgotPasswordComponent),
  },
  { path: '**', redirectTo: '' }
];
