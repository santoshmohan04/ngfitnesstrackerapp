import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { trainingsdata } from '../training.actions';
import { FormsModule, NgForm } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { TrainingService } from '../training.service';
import { UiService } from 'src/app/shared/ui.service';
import { Subscription } from 'rxjs';
import { Exercise } from '../exercise.model';

export const CATEGORIES = ['Cardio', 'Strength', 'Flexibility', 'Balance', 'HIIT', 'Other'];

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    MatCardModule,
    CommonModule,
    MatFormFieldModule,
    FlexLayoutModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatButtonModule,
    MatChipsModule,
    MatExpansionModule,
    MatInputModule,
  ],
})
export class NewTrainingComponent implements OnInit, OnDestroy {
  store = inject(Store);
  isLoading: boolean = false;
  trainingservice = inject(TrainingService);
  uiService = inject(UiService);
  exerciseSubscription: Subscription | null = null;

  allExercises: Exercise[] = [];
  selectedCategory: string = 'All';
  categories: string[] = ['All'];
  selectedExercise: Exercise | null = null;

  readonly CATEGORIES = CATEGORIES;
  readonly difficulties = ['Beginner', 'Intermediate', 'Advanced'];

  get filteredExercises(): Exercise[] {
    if (this.selectedCategory === 'All') return this.allExercises;
    return this.allExercises.filter((e) => e.category === this.selectedCategory);
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.fetchExercises();
  }

  fetchExercises() {
    this.exerciseSubscription = this.trainingservice.getAvailableExercises().subscribe({
      next: (res) => {
        this.isLoading = false;
        this.allExercises = res;
        const trainingdata = res.map((t) => ({
          id: t.id,
          name: t.name,
          duration: t.duration,
          calories: t.calories,
          category: t.category,
          difficulty: t.difficulty,
        }));
        if (trainingdata.length > 0) {
          this.store.dispatch(
            trainingsdata.setavailabletrainings({
              data: trainingdata,
            })
          );
        }
        this.categories = [
          'All',
          ...new Set(res.filter((e) => e.category).map((e) => e.category!)),
        ];
      },
      error: () => {
        this.isLoading = false;
        this.uiService.showSnackbar(
          'Fetching Exercises failed, please try again later',
          null,
          3000
        );
      },
    });
  }

  onCategoryChange(category: string): void {
    this.selectedCategory = category;
    this.selectedExercise = null;
  }

  onExerciseChange(exerciseId: string): void {
    this.selectedExercise = this.allExercises.find((e) => e.id === exerciseId) ?? null;
  }

  onStartTraining(f: NgForm) {
    this.store.dispatch(
      trainingsdata.starttraining({ data: f.form.value.exercise })
    );
  }

  onCreateExercise(form: NgForm): void {
    if (form.invalid) return;
    const { name, duration, calories, category, difficulty } = form.value;
    this.trainingservice
      .createCustomExercise({
        name,
        duration: Number(duration),
        calories: Number(calories),
        category: category || undefined,
        difficulty: difficulty || undefined,
      })
      .subscribe({
        next: () => {
          this.uiService.showSnackbar('Custom exercise created successfully!', null, 3000);
          form.resetForm();
          this.fetchExercises();
        },
        error: () => {
          this.uiService.showSnackbar('Failed to create custom exercise.', null, 3000);
        },
      });
  }

  ngOnDestroy(): void {
    if (this.exerciseSubscription) {
      this.exerciseSubscription.unsubscribe();
    }
  }
}
