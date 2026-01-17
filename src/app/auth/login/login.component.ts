import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  Validators,
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
} from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { authdata } from '../auth.actions';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    FlexLayoutModule,
    MatButtonModule,
    CommonModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule
  ],
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm!: FormGroup;
  fb = inject(FormBuilder);
  hide: boolean = true;
  isLoading = false;
  router = inject(Router);
  store = inject(Store);
  authSubscription: Subscription | null = null;

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });

    // Subscribe to auth loading state
    this.authSubscription = this.store.select((state: any) => state.auth?.isLoading)
      .subscribe((loading) => {
        this.isLoading = loading;
      });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }
    const { email, password } = this.loginForm.value;
    this.store.dispatch(authdata.login({ email, password }));
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }
}
