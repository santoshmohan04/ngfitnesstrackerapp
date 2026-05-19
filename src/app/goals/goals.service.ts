import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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
  private readonly apiUrl = environment.apiUrl;
  constructor(private readonly http: HttpClient) {}

  setGoal(goal: Goal): Observable<Goal> {
    return this.http.post<Goal>(`${this.apiUrl}/goals`, goal);
  }

  getCurrentGoal(): Observable<GoalProgress> {
    return this.http.get<GoalProgress>(`${this.apiUrl}/goals/current`);
  }
}
