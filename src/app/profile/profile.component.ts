import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ProfileService, UserProfile } from './profile.service';
import { AchievementsService, Achievement } from '../shared/achievements.service';
import { TrainingService } from '../training/training.service';
import { UiService } from '../shared/ui.service';

function passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
  const newPwd = group.get('newPassword')?.value;
  const confirmPwd = group.get('confirmPassword')?.value;
  return newPwd && confirmPwd && newPwd !== confirmPwd ? { passwordMismatch: true } : null;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatProgressSpinnerModule,
    FlexLayoutModule,
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit, OnDestroy {
  profile: UserProfile | null = null;
  achievements: Achievement[] = [];
  isLoading = false;
  isSaving = false;
  isChangingPassword = false;
  hideCurrentPassword = true;
  hideNewPassword = true;
  hideConfirmPassword = true;

  profileForm!: FormGroup;
  passwordForm!: FormGroup;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly profileService: ProfileService,
    private readonly achievementsService: AchievementsService,
    private readonly trainingService: TrainingService,
    private readonly uiService: UiService,
    private readonly store: Store,
    private readonly fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
    });

    this.passwordForm = this.fb.group(
      {
        currentPassword: ['', [Validators.required, Validators.minLength(6)]],
        newPassword: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
      },
      { validators: passwordMatchValidator },
    );

    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    let pending = 2;
    const done = () => { if (--pending === 0) this.isLoading = false; };

    this.profileService.getProfile().pipe(takeUntil(this.destroy$)).subscribe({
      next: profile => {
        this.profile = profile;
        this.profileForm.patchValue({
          firstName: profile.firstName,
          lastName: profile.lastName,
        });
        done();
      },
      error: () => done(),
    });

    this.trainingService.getCompletedOrCancelledExercises().pipe(takeUntil(this.destroy$)).subscribe({
      next: exercises => {
        this.achievements = this.achievementsService.compute(exercises);
        done();
      },
      error: () => {
        this.achievements = this.achievementsService.compute([]);
        done();
      },
    });
  }

  get initials(): string {
    const first = this.profile?.firstName?.[0] ?? '';
    const last = this.profile?.lastName?.[0] ?? '';
    return (first + last).toUpperCase() || '?';
  }

  get earnedCount(): number {
    return this.achievements.filter(a => a.earned).length;
  }

  onUpdateProfile(): void {
    if (this.profileForm.invalid) return;
    this.isSaving = true;
    this.profileService.updateProfile(this.profileForm.value).pipe(takeUntil(this.destroy$)).subscribe({
      next: updated => {
        this.profile = updated;
        this.uiService.showSnackbar('Profile updated successfully!', null, 3000);
        this.isSaving = false;
      },
      error: () => {
        this.uiService.showSnackbar('Failed to update profile. Please try again.', null, 3000);
        this.isSaving = false;
      },
    });
  }

  onChangePassword(): void {
    if (this.passwordForm.invalid) return;
    this.isChangingPassword = true;
    const { currentPassword, newPassword } = this.passwordForm.value;
    this.profileService.changePassword({ currentPassword, newPassword }).pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.uiService.showSnackbar('Password changed successfully!', null, 3000);
        this.passwordForm.reset();
        this.isChangingPassword = false;
      },
      error: () => {
        this.uiService.showSnackbar('Failed to change password. Please try again.', null, 3000);
        this.isChangingPassword = false;
      },
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
