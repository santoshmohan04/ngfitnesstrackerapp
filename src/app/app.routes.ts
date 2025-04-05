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
];
