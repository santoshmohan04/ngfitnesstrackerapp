import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Exercise } from '../exercise.model';

@Component({
  selector: 'app-edit-exercise-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  template: `
    <h2 mat-dialog-title>Edit Exercise</h2>
    <mat-dialog-content>
      <form [formGroup]="form">
        <mat-form-field style="width:100%; margin-bottom:12px;">
          <mat-label>Name</mat-label>
          <input matInput formControlName="name" />
          @if (form.get('name')?.hasError('required')) {
            <mat-error>Name is required</mat-error>
          }
        </mat-form-field>
        <mat-form-field style="width:100%; margin-bottom:12px;">
          <mat-label>Duration (seconds)</mat-label>
          <input matInput type="number" formControlName="duration" />
          @if (form.get('duration')?.hasError('required')) {
            <mat-error>Duration is required</mat-error>
          }
          @if (form.get('duration')?.hasError('min')) {
            <mat-error>Duration must be at least 1</mat-error>
          }
        </mat-form-field>
        <mat-form-field style="width:100%;">
          <mat-label>Calories</mat-label>
          <input matInput type="number" formControlName="calories" />
          @if (form.get('calories')?.hasError('required')) {
            <mat-error>Calories is required</mat-error>
          }
          @if (form.get('calories')?.hasError('min')) {
            <mat-error>Calories cannot be negative</mat-error>
          }
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-raised-button color="primary" [disabled]="form.invalid" (click)="onSubmit()">Save</button>
    </mat-dialog-actions>
  `,
})
export class EditExerciseDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<EditExerciseDialogComponent>);
  readonly data = inject<Exercise>(MAT_DIALOG_DATA);

  form = this.fb.group({
    name: [this.data.name, Validators.required],
    duration: [this.data.duration, [Validators.required, Validators.min(1)]],
    calories: [this.data.calories, [Validators.required, Validators.min(0)]],
  });

  onSubmit() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }

  onCancel() {
    this.dialogRef.close(null);
  }
}
