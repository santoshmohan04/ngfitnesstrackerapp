import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stop-training',
  template: `
    <h1 mat-dialog-title>Are you sure you want to stop {{passedData.name}}?</h1>
    <mat-dialog-content>
      <mat-progress-bar mode="determinate" [value]="passedData.progress"></mat-progress-bar>
      <p>You already got {{passedData.progress}}%</p>
      <p>Calories burned: {{ (passedData.calories * passedData.progress / 100) | number:'1.0-1' }} cal</p>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button [mat-dialog-close]="'complete'" color="primary">Mark as Complete</button>
      <button mat-button [mat-dialog-close]="true" color="warn">Cancel Workout</button>
      <button mat-button [mat-dialog-close]="false">No</button>
    </mat-dialog-actions>
  `,
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatProgressBarModule, CommonModule],
})
export class StopTrainingComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public passedData: { progress: number; name: string; calories: number }) {}
}
