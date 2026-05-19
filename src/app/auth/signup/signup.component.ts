import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { authdata } from '../auth.actions';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatButtonModule,
    FlexLayoutModule,
    CommonModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatCardModule
  ],
})
export class SignupComponent implements OnInit {
  store = inject(Store);
  maxDate: Date;
  hide: boolean = true;
  isLoading: boolean = false;
  router = inject(Router);
  passwordStrength: number = 0;
  passwordStrengthLabel: string = '';

  get strengthColor(): 'warn' | 'accent' | 'primary' {
    if (this.passwordStrength <= 1) return 'warn';
    if (this.passwordStrength === 2) return 'accent';
    return 'primary';
  }

  onPasswordInput(value: string) {
    if (!value) {
      this.passwordStrength = 0;
      this.passwordStrengthLabel = '';
      return;
    }
    const hasUpper = /[A-Z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    const hasSpecial = /[^A-Za-z0-9]/.test(value);

    if (value.length < 6) {
      this.passwordStrength = 1;
      this.passwordStrengthLabel = 'Weak';
    } else if (value.length >= 10 && hasUpper && hasNumber && hasSpecial) {
      this.passwordStrength = 4;
      this.passwordStrengthLabel = 'Strong';
    } else if (value.length >= 8 && (hasNumber || hasSpecial)) {
      this.passwordStrength = 3;
      this.passwordStrengthLabel = 'Good';
    } else {
      this.passwordStrength = 2;
      this.passwordStrengthLabel = 'Fair';
    }
  }

  ngOnInit(): void {
    this.maxDate = new Date();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 16);

    // Subscribe to auth loading state
    this.store.select((state: any) => state.auth?.isLoading)
      .subscribe((loading) => {
        this.isLoading = loading;
      });
  }

  submitForm(f: NgForm) {
    if (f.form.invalid) {
      return;
    }
    const formValues = f.form.value;
    const { email, password, firstName, lastName } = formValues;
    this.store.dispatch(authdata.signup({ email, password, firstName, lastName }));
  }
}
