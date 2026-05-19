import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatListModule } from '@angular/material/list';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TrainingService, ExerciseStats, FinishedExercise } from '../training/training.service';
import { GoalsService, GoalProgress, Goal } from '../goals/goals.service';
import { UiService } from '../shared/ui.service';
import { selectUserDtls } from '../auth/auth.selectors';
import { User } from '../auth/user.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressBarModule,
    MatIconModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatListModule,
    FlexLayoutModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  stats: ExerciseStats | null = null;
  recentExercises: FinishedExercise[] = [];
  goalProgress: GoalProgress | null = null;
  isLoading = false;
  loggedInUser: User | null = null;
  goalForm: Goal = {};

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly trainingService: TrainingService,
    private readonly goalsService: GoalsService,
    private readonly uiService: UiService,
    private readonly store: Store,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    this.store.select(selectUserDtls).pipe(takeUntil(this.destroy$)).subscribe(user => {
      this.loggedInUser = user;
    });
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    let pending = 3;
    const done = () => { if (--pending === 0) this.isLoading = false; };

    this.trainingService.getExerciseStats().pipe(takeUntil(this.destroy$)).subscribe({
      next: stats => { this.stats = stats; done(); },
      error: () => done(),
    });

    this.trainingService.getCompletedOrCancelledExercises().pipe(takeUntil(this.destroy$)).subscribe({
      next: exercises => { this.recentExercises = exercises.slice(0, 5); done(); },
      error: () => done(),
    });

    this.goalsService.getCurrentGoal().pipe(takeUntil(this.destroy$)).subscribe({
      next: goal => { this.goalProgress = goal; done(); },
      error: () => done(),
    });
  }

  get totalHours(): number {
    if (!this.stats) return 0;
    return Math.round((this.stats.totalDuration / 3600) * 10) / 10;
  }

  get sessionsProgress(): number {
    if (!this.goalProgress?.targetSessions) return 0;
    return Math.min(100, (this.goalProgress.currentSessions / this.goalProgress.targetSessions) * 100);
  }

  get caloriesProgress(): number {
    if (!this.goalProgress?.targetCalories) return 0;
    return Math.min(100, (this.goalProgress.currentCalories / this.goalProgress.targetCalories) * 100);
  }

  get minutesProgress(): number {
    if (!this.goalProgress?.targetMinutes) return 0;
    return Math.min(100, (this.goalProgress.currentMinutes / this.goalProgress.targetMinutes) * 100);
  }

  onStartTraining(): void {
    this.router.navigate(['/training']);
  }

  onSaveGoal(): void {
    this.goalsService.setGoal(this.goalForm).pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.uiService.showSuccess('Goal saved successfully!');
        this.loadData();
      },
      error: () => this.uiService.showError('Failed to save goal. Please try again.'),
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
