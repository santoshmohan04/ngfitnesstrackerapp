import { Component, OnInit, inject, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatListModule } from '@angular/material/list';
import { NgxEchartsDirective } from 'ngx-echarts';
import type { EChartsOption } from 'echarts';

import { TrainingService, ExerciseStats, FinishedExercise } from '../training/training.service';
import { GoalsService, GoalProgress, Goal } from '../goals/goals.service';
import { UiService } from '../shared/ui.service';
import { selectUserDtls } from '../auth/auth.selectors';
import { TotalHoursPipe } from './total-hours.pipe';

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
    NgxEchartsDirective,
    TotalHoursPipe
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  private readonly trainingService = inject(TrainingService);
  private readonly goalsService = inject(GoalsService);
  private readonly uiService = inject(UiService);
  private readonly store = inject(Store);
  private readonly router = inject(Router);

  // Store Selection directly to a Signal
  loggedInUser = this.store.selectSignal(selectUserDtls);

  // State Signals
  stats = this.trainingService.exerciseStats;
  recentExercises = computed(() => this.trainingService.finishedExercises().slice(0, 5));
  goalProgress = this.goalsService.currentGoal;
  isLoading = signal(false);
  
  goalForm: Goal = {};

  // Computed Values (Derived State)
  sessionsProgress = computed(() => {
    const progress = this.goalProgress();
    return progress?.targetSessions ? Math.min(100, (progress.currentSessions / progress.targetSessions) * 100) : 0;
  });

  caloriesProgress = computed(() => {
    const progress = this.goalProgress();
    return progress?.targetCalories ? Math.min(100, (progress.currentCalories / progress.targetCalories) * 100) : 0;
  });

  minutesProgress = computed(() => {
    const progress = this.goalProgress();
    return progress?.targetMinutes ? Math.min(100, (progress.currentMinutes / progress.targetMinutes) * 100) : 0;
  });

  // ECharts Configuration mapping from recent exercises
  chartOptions = computed<EChartsOption>(() => {
    // Reverse to show oldest to newest left-to-right
    const exercises = [...this.recentExercises()].reverse(); 
    const dates = exercises.map(ex => new Date(ex.date!).toLocaleDateString());
    const calories = exercises.map(ex => ex.calories);

    return {
      tooltip: { trigger: 'axis' },
      xAxis: { type: 'category', data: dates, axisLabel: { color: '#fff' } },
      yAxis: { type: 'value', axisLabel: { color: '#fff' }, splitLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.12)' } } },
      series: [{
        data: calories,
        type: 'bar',
        color: '#c2185b',
        itemStyle: { borderRadius: [4, 4, 0, 0] }
      }]
    };
  });

  constructor() {
    // Automatically populate the form whenever the goal data changes
    effect(() => {
      const goal = this.goalProgress();
      if (goal) {
        this.goalForm = { targetSessions: goal.targetSessions, targetCalories: goal.targetCalories, targetMinutes: goal.targetMinutes };
      }
    });
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    // Trigger the services to load data into their signals
    this.trainingService.loadExerciseStats();
    this.trainingService.loadCompletedOrCancelledExercises();

    // We'll keep the subscribe here just to handle dismissing the local loading spinner
    this.isLoading.set(true);
    this.goalsService.getCurrentGoal().subscribe({
      next: () => this.isLoading.set(false),
      error: () => this.isLoading.set(false),
    });
  }

  onStartTraining(): void {
    this.router.navigate(['/training']);
  }

  onSaveGoal(): void {
    this.goalsService.setGoal(this.goalForm).subscribe({
      next: () => {
        this.uiService.showSuccess('Goal saved successfully!');
        this.loadData();
      },
      error: () => this.uiService.showError('Failed to save goal. Please try again.'),
    });
  }
}
