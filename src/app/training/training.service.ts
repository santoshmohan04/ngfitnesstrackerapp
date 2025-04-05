import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  addDoc,
} from '@angular/fire/firestore';
import { Exercise } from './exercise.model';
import { EMPTY, Observable, catchError, from, tap } from 'rxjs';
import { Store } from '@ngrx/store';
import { trainingsdata } from './training.actions';

@Injectable({
  providedIn: 'root',
})
export class TrainingService {
  constructor(
    private readonly firestore: Firestore,
    private readonly store: Store,
  ) {}

  /** ✅ Fetch Available Exercises */
  getAvailableExercises(): Observable<Exercise[]> {
    const exercisesCollection = collection(this.firestore, 'availableExercises');
    return collectionData(exercisesCollection, { idField: 'id' }) as Observable<Exercise[]>;
  }

  /** ✅ Add Completed Exercise */
  addToDatabase(data: Exercise): Observable<void> {
    const finishedExercisesCollection = collection(this.firestore, 'finishedExercises');
    return from(addDoc(finishedExercisesCollection, data)).pipe(
      tap(() => this.store.dispatch(trainingsdata.stoptraining())),
      catchError((error) => {
        console.error('Error adding to database', error);
        return EMPTY; // Or throwError(() => error); if you want to propagate the error
      })
    ) as Observable<void>;
  }

  /** ✅ Complete Exercise */
  completeExercise(data: Exercise): Observable<void> {
    const updatedData = {
      ...data,
      date: new Date(),
      state: 'completed',
    };
    const finishedExercisesCollection = collection(this.firestore, 'finishedExercises');
    return from(addDoc(finishedExercisesCollection, updatedData)).pipe(
      tap(() => this.store.dispatch(trainingsdata.stoptraining())),
      catchError((error) => {
        console.error('Error completing exercise', error);
        return EMPTY; // Or throwError(() => error); if you want to propagate the error
      })
    ) as Observable<void>;
  }

  /** ✅ Cancel Exercise */
  cancelExercise(data: Exercise, progress: number): Observable<void> {
    const updatedData = {
      ...data,
      duration: data.duration * (progress / 100),
      calories: data.calories * (progress / 100),
      date: new Date(),
      state: 'cancelled',
    };
    const finishedExercisesCollection = collection(this.firestore, 'finishedExercises');
    return from(addDoc(finishedExercisesCollection, updatedData)).pipe(
      tap(() => this.store.dispatch(trainingsdata.stoptraining())),
      catchError((error) => {
        console.error('Error cancelling exercise', error);
        return EMPTY; // Or throwError(() => error); if you want to propagate the error
      })
    ) as Observable<void>;
  }

  /** ✅ Fetch Completed or Cancelled Exercises */
  getCompletedOrCancelledExercises(): Observable<Exercise[]> {
    const finishedExercisesCollection = collection(this.firestore, 'finishedExercises');
    return collectionData(finishedExercisesCollection, { idField: 'id' }) as Observable<Exercise[]>;
  }
}