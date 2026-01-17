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
}
