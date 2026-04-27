import { Injectable } from '@angular/core';
import { Exercise } from '../training/exercise.model';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earned: boolean;
}

@Injectable({ providedIn: 'root' })
export class AchievementsService {
  private readonly ONE_DAY_MS = 86400000;
  compute(finishedExercises: Exercise[]): Achievement[] {
    const completed = finishedExercises.filter(e => e.state === 'completed');
    const totalCalories = completed.reduce((sum, e) => sum + (e.calories || 0), 0);
    const streak = this.computeStreak(completed);

    return [
      {
        id: 'first_workout',
        title: 'First Workout',
        description: 'Complete your first workout',
        icon: 'emoji_events',
        earned: completed.length >= 1
      },
      {
        id: 'ten_workouts',
        title: '10 Workouts',
        description: 'Complete 10 workouts',
        icon: 'fitness_center',
        earned: completed.length >= 10
      },
      {
        id: '1000_calories',
        title: 'Calorie Crusher',
        description: 'Burn 1000 calories total',
        icon: 'local_fire_department',
        earned: totalCalories >= 1000
      },
      {
        id: '7_day_streak',
        title: '7-Day Streak',
        description: '7 consecutive days with workouts',
        icon: 'whatshot',
        earned: streak >= 7
      },
      {
        id: 'never_give_up',
        title: 'Never Give Up',
        description: 'Complete 10 workouts without cancelling any',
        icon: 'shield',
        earned: finishedExercises.length >= 10 && completed.length === finishedExercises.length
      }
    ];
  }

  private computeStreak(completed: Exercise[]): number {
    if (!completed.length) return 0;
    const days = [...new Set(completed.map(e =>
      new Date(e.date!).toDateString()
    ))].map(d => new Date(d).getTime()).sort((a, b) => b - a);

    let streak = 1;
    for (let i = 1; i < days.length; i++) {
      if (days[i - 1] - days[i] === this.ONE_DAY_MS) streak++;
      else break;
    }
    return streak;
  }
}
