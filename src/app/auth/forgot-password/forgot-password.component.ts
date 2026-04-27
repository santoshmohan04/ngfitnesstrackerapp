import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AuthService } from '../auth.service';
import { UiService } from 'src/app/shared/ui.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FlexLayoutModule,
  ],
  template: `
    <div fxLayout="column" fxLayoutAlign="center center" style="min-height: calc(100vh - 64px); padding: 24px;">
      <mat-card style="width: 100%; max-width: 400px; padding: 32px;">
        <h2 style="margin-top: 0;">Reset Password</h2>
        <form [formGroup]="forgotForm" (ngSubmit)="onSubmit()" fxLayout="column" fxLayoutGap="16px">
          <mat-form-field>
            <input
              type="email"
              matInput
              placeholder="Your email address"
              formControlName="email"
              aria-label="Email address"
            />
            <mat-hint>Enter the email associated with your account.</mat-hint>
            <mat-error *ngIf="forgotForm.get('email')?.hasError('required')">Email is required.</mat-error>
            <mat-error *ngIf="forgotForm.get('email')?.hasError('email')">Enter a valid email address.</mat-error>
          </mat-form-field>
          <button
            type="submit"
            mat-raised-button
            color="primary"
            [disabled]="forgotForm.invalid"
            aria-label="Submit password reset request"
          >Submit</button>
          <a routerLink="/login" mat-stroked-button aria-label="Back to login">Back to Login</a>
        </form>
      </mat-card>
    </div>
  `,
})
export class ForgotPasswordComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private uiService = inject(UiService);

  forgotForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  onSubmit() {
    if (this.forgotForm.invalid) {
      return;
    }
    const email = this.forgotForm.value.email as string;
    this.authService.forgotPassword(email).subscribe({
      next: (res) => {
        this.uiService.showSnackbar(res.message || 'Password reset email sent.', null, 4000);
        this.forgotForm.reset();
      },
      error: (err) => {
        this.uiService.showSnackbar(err.message || 'Failed to send reset email.', null, 4000);
      },
    });
  }
}
