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
import {
  getAuth,
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { UiService } from 'src/app/shared/ui.service';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner'

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
  authSubscription: Subscription | null = null;
  auth = getAuth();
  uiservice = inject(UiService);

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });

    this.initiateUserSub();
  }

  initiateUserSub() {
    this.authSubscription = new Subscription();
    const authUnsubscribe = onAuthStateChanged(
      this.auth,
      (user: User | null) => {
        if (user) {
          this.router.navigate(['/training']);
        } else {
          this.uiservice.logout();
        }
      }
    );
    this.authSubscription.add(authUnsubscribe);
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }
    this.isLoading = true;
    const { email, password } = this.loginForm.value;
    signInWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
        // Signed in
        this.isLoading = false;
        const user = userCredential.user;
        console.log('User logged in:', user);
        this.router.navigate(['/training']);
      })
      .catch((error) => {
        this.isLoading = false;
        this.uiservice.showSnackbar(error.message, null, 3000);
        console.error('Login failed:', error);
      });
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }
}
