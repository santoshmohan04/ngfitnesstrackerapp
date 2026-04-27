import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Exercise } from './exercise.model';
import { Observable, tap } from 'rxjs';
import { Store } from '@ngrx/store';
import { trainingsdata } from './training.actions';
import { environment } from '../../environments/environment';

export interface CreateFinishedExerciseRequest {
  name: string;
  duration: number;
  calories: number;
  date: string; // ISO 8601 format
  state: 'completed' | 'cancelled';
}

export interface FinishedExercise extends Exercise {
  userId: string;
  date: Date;
  state: 'completed' | 'cancelled';
}

@Injectable({
  providedIn: 'root',
})
export class TrainingService {
  private readonly apiUrl = environment.apiUrl;

  constructor(
    private readonly http: HttpClient,
    private readonly store: Store,
  ) {}

  /** ✅ Fetch Available Exercises */
  getAvailableExercises(): Observable<Exercise[]> {
    return this.http.get<Exercise[]>(`${this.apiUrl}/exercises/available`);
  }

  /** ✅ Add Finished Exercise */
  addFinishedExercise(data: CreateFinishedExerciseRequest): Observable<FinishedExercise> {
    return this.http.post<FinishedExercise>(`${this.apiUrl}/exercises/finished`, data).pipe(
      tap(() => this.store.dispatch(trainingsdata.stoptraining()))
    );
  }

  /** ✅ Complete Exercise */
  completeExercise(data: Exercise): Observable<FinishedExercise> {
    const requestData: CreateFinishedExerciseRequest = {
      name: data.name,
      duration: data.duration,
      calories: data.calories,
      date: new Date().toISOString(),
      state: 'completed',
    };
    return this.addFinishedExercise(requestData);
  }

  /** ✅ Cancel Exercise */
  cancelExercise(data: Exercise, progress: number): Observable<FinishedExercise> {
    const requestData: CreateFinishedExerciseRequest = {
      name: data.name,
      duration: data.duration * (progress / 100),
      calories: data.calories * (progress / 100),
      date: new Date().toISOString(),
      state: 'cancelled',
    };
    return this.addFinishedExercise(requestData);
  }

  /** ✅ Fetch Completed or Cancelled Exercises */
  getCompletedOrCancelledExercises(): Observable<FinishedExercise[]> {
    return this.http.get<FinishedExercise[]>(`${this.apiUrl}/exercises/finished`);
  }

  /** Fetch Available Exercises with optional filters */
  getAvailableExercisesFiltered(category?: string, difficulty?: string): Observable<Exercise[]> {
    let params: Record<string, string> = {};
    if (category) params['category'] = category;
    if (difficulty) params['difficulty'] = difficulty;
    return this.http.get<Exercise[]>(`${this.apiUrl}/exercises/available`, { params });
  }

  /** Create a custom exercise */
  createCustomExercise(data: { name: string; duration: number; calories: number; category?: string; difficulty?: string }): Observable<Exercise> {
    return this.http.post<Exercise>(`${this.apiUrl}/exercises/available`, data);
  }

  /** Delete a custom exercise */
  deleteCustomExercise(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/exercises/available/${id}`);
  }

  /** Update a finished exercise */
  updateFinishedExercise(id: string, data: Partial<FinishedExercise>): Observable<FinishedExercise> {
    return this.http.put<FinishedExercise>(`${this.apiUrl}/exercises/finished/${id}`, data);
  }

  /** Delete a finished exercise */
  deleteFinishedExercise(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/exercises/finished/${id}`);
  }

  /** Get exercise stats */
  getExerciseStats(): Observable<{ totalSessions: number; totalCalories: number; totalDuration: number; streakDays: number; completionRate: number }> {
    return this.http.get<{ totalSessions: number; totalCalories: number; totalDuration: number; streakDays: number; completionRate: number }>(`${this.apiUrl}/exercises/finished/stats`);
  }

  /** Get exercise summary grouped by week or month */
  getExerciseSummary(groupBy: 'week' | 'month'): Observable<{ period: string; totalCalories: number; totalDuration: number; sessions: number }[]> {
    return this.http.get<{ period: string; totalCalories: number; totalDuration: number; sessions: number }[]>(
      `${this.apiUrl}/exercises/finished/summary`, { params: { groupBy } }
    );
  }
}
