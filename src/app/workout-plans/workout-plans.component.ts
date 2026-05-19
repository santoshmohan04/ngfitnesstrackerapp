import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { WorkoutPlansService, WorkoutPlan } from './workout-plans.service';
import { TrainingService } from '../training/training.service';
import { UiService } from '../shared/ui.service';
import { Exercise } from '../training/exercise.model';
import { DeleteExerciseDialogComponent } from '../training/past-trainings/delete-exercise-dialog.component';

@Component({
  selector: 'app-workout-plans',
  standalone: true,
  templateUrl: './workout-plans.component.html',
  styleUrls: ['./workout-plans.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatDialogModule,
  ],
})
export class WorkoutPlansComponent implements OnInit {
  private readonly workoutPlansService = inject(WorkoutPlansService);
  private readonly trainingService = inject(TrainingService);
  private readonly uiService = inject(UiService);
  private readonly dialog = inject(MatDialog);
  private readonly fb = inject(FormBuilder);

  plans: WorkoutPlan[] = [];
  availableExercises: Exercise[] = [];
  isLoading = false;

  planForm = this.fb.group({
    name: ['', Validators.required],
    exerciseIds: [[] as string[]],
  });

  ngOnInit(): void {
    this.loadPlans();
    this.loadAvailableExercises();
  }

  loadPlans() {
    this.isLoading = true;
    this.workoutPlansService.getPlans().subscribe({
      next: (plans) => {
        this.plans = plans;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading plans', err);
        this.isLoading = false;
      },
    });
  }

  loadAvailableExercises() {
    this.trainingService.getAvailableExercises().subscribe({
      next: (exercises) => {
        this.availableExercises = exercises;
      },
      error: (err) => console.error('Error loading exercises', err),
    });
  }

  onCreatePlan() {
    if (this.planForm.invalid) return;
    const { name, exerciseIds } = this.planForm.value;
    const plan: WorkoutPlan = {
      name: name!,
      exerciseIds: exerciseIds || [],
    };
    this.workoutPlansService.createPlan(plan).subscribe({
      next: () => {
        this.uiService.showSuccess('Workout plan created!');
        this.planForm.reset({ name: '', exerciseIds: [] });
        this.loadPlans();
      },
      error: (err) => {
        console.error('Error creating plan', err);
        this.uiService.showError('Failed to create plan');
      },
    });
  }

  onDeletePlan(id: string) {
    const dialogRef = this.dialog.open(DeleteExerciseDialogComponent, {
      data: { name: 'this workout plan' },
    });
    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.workoutPlansService.deletePlan(id).subscribe({
          next: () => {
            this.plans = this.plans.filter((p) => p.id !== id);
            this.uiService.showSuccess('Plan deleted');
          },
          error: (err) => {
            console.error('Error deleting plan', err);
            this.uiService.showError('Failed to delete plan');
          },
        });
      }
    });
  }

  onStartPlan(_plan: WorkoutPlan) {
    this.uiService.showInfo('Start plan feature coming soon!');
  }

  getExerciseNames(ids: string[]): string {
    return ids
      .map((id) => this.availableExercises.find((e) => e.id === id)?.name || id)
      .join(', ');
  }
}

