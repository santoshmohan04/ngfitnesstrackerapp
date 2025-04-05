import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectIsTrainingDtls } from './training.selector';
import { MatTabsModule } from '@angular/material/tabs';
import { CurrentTrainingComponent } from './current-training/current-training.component';
import { PastTrainingsComponent } from './past-trainings/past-trainings.component';
import { NewTrainingComponent } from './new-training/new-training.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.scss'],
  standalone: true,
  imports:[MatTabsModule, CurrentTrainingComponent, PastTrainingsComponent, NewTrainingComponent, CommonModule]
})
export class TrainingComponent {
  store = inject(Store);
  ongoingTraining$ = this.store.select(selectIsTrainingDtls);
}
