import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { StopTrainingComponent } from './stop-training.component';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { selectActiveTrainingDtls } from '../training.selector';
import { Exercise } from '../exercise.model';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { TrainingService } from '../training.service';

@Component({
  selector: 'app-current-training',
  templateUrl: './current-training.component.html',
  styleUrls: ['./current-training.component.scss'],
  standalone: true,
  imports:[MatProgressSpinnerModule, FlexLayoutModule,MatButtonModule]
})
export class CurrentTrainingComponent implements OnInit, OnDestroy {
  progress: number = 0;
  timer: number;
  dialog = inject(MatDialog);
  store = inject(Store);
  destroy$: Subject<boolean> = new Subject<boolean>();
  currentexercise!:Exercise;
  trainingservice = inject(TrainingService);

  ngOnInit(): void {
    this.startOrResumeTimer();
  }

  startOrResumeTimer(): void {
    this.store
      .select(selectActiveTrainingDtls)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (exercise) => {
          if(exercise){
            this.currentexercise = exercise;
          const step = (exercise.duration / 100) * 1000;
          // @ts-ignore
          this.timer = setInterval(() => {
            this.progress += 1;
            if (this.progress >= 100) {
              this.trainingservice.completeExercise(exercise).subscribe();
              clearInterval(this.timer);
            }
          }, step);
          }
        },
      });
  }

  stop(): void {
    clearInterval(this.timer);
    const dialogRef = this.dialog.open(StopTrainingComponent, {
      data: { progress: this.progress, name: this.currentexercise.name },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.trainingservice.cancelExercise(this.currentexercise, this.progress).subscribe();
      } else {
        this.startOrResumeTimer();
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
