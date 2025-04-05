import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { trainingsdata } from '../training.actions';
import { selectAvailableTrainingsDtls } from '../training.selector';
import { FormsModule, NgForm } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { TrainingService } from '../training.service';
import { UiService } from 'src/app/shared/ui.service';
import { Subscription } from 'rxjs';
import { getAuth, User, onAuthStateChanged } from 'firebase/auth';

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
  ],
})
export class NewTrainingComponent implements OnInit, OnDestroy {
  store = inject(Store);
  exercises$ = this.store.select(selectAvailableTrainingsDtls);
  isLoading:boolean = false;
  trainingservice = inject(TrainingService);
  uiService = inject(UiService);
  authSubscription: Subscription | null = null;
  auth = getAuth();

  ngOnInit(): void {
    this.isLoading = true
    this.fetchExercises();
  }

  fetchExercises() {
    this.authSubscription = new Subscription();
    const authUnsubscribe = onAuthStateChanged(
      this.auth,
      (user: User | null) => {
        if (user) {
          this.trainingservice.getAvailableExercises().subscribe({
            next: (res) => {
              this.isLoading = false;
              const trainingdata = res.map((t) => ({
                id: t.id,
                name: t.name,
                duration: t.duration,
                calories: t.calories,
              }));
              if (trainingdata.length > 0) {
                this.store.dispatch(
                  trainingsdata.setavailabletrainings({
                    data: trainingdata,
                  })
                );
              }
            },
            error: (err) => {
              this.isLoading = false;
              this.uiService.showSnackbar(
                'Fetching Exercises failed, please try again later',
                null,
                3000
              );
            },
          });
        }
      }
    );
    this.authSubscription.add(authUnsubscribe);
    
  }

  onStartTraining(f: NgForm) {
    this.store.dispatch(
      trainingsdata.starttraining({ data: f.form.value.exercise })
    );
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }
}
