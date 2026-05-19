import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Goal {
  targetSessions?: number;
  targetCalories?: number;
  targetMinutes?: number;
}

export interface GoalProgress extends Goal {
  currentSessions: number;
  currentCalories: number;
  currentMinutes: number;
}

@Injectable({ providedIn: 'root' })
export class GoalsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  // Reactive State using Angular Signals
  private readonly _currentGoal = signal<GoalProgress | null>(null);
  public readonly currentGoal = this._currentGoal.asReadonly();

  setGoal(goal: Goal): Observable<Goal> {
    return this.http.post<Goal>(`${this.apiUrl}/goals`, goal);
  }

  /** ✅ Fetch Current Goal Progress */
  getCurrentGoal(): Observable<GoalProgress> {
    return this.http.get<GoalProgress>(`${this.apiUrl}/goals/current`).pipe(
      tap(goal => this._currentGoal.set(goal))
    );
  }

  /** ✅ Load Current Goal Progress into Signal */
  loadCurrentGoal(): void {
    this.getCurrentGoal().subscribe();
  }
}
