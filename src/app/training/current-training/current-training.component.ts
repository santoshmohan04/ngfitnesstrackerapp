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
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-current-training',
  templateUrl: './current-training.component.html',
  styleUrls: ['./current-training.component.scss'],
  standalone: true,
  imports: [MatProgressSpinnerModule, FlexLayoutModule, MatButtonModule, CommonModule],
})
export class CurrentTrainingComponent implements OnInit, OnDestroy {
  progress: number = 0;
  timer: ReturnType<typeof setInterval> | null = null;
  isPaused: boolean = false;
  isCompleted: boolean = false;
  dialog = inject(MatDialog);
  store = inject(Store);
  destroy$: Subject<boolean> = new Subject<boolean>();
  currentexercise!: Exercise;
  trainingservice = inject(TrainingService);

  private audioContext: AudioContext | null = null;
  private readonly playedMilestones = new Set<number>();

  get caloriesBurned(): number {
    if (!this.currentexercise) return 0;
    return Math.round(this.currentexercise.calories * this.progress / 100 * 10) / 10;
  }

  get timeRemaining(): number {
    if (!this.currentexercise) return 0;
    return Math.round(this.currentexercise.duration * (100 - this.progress) / 100);
  }

  ngOnInit(): void {
    this.store
      .select(selectActiveTrainingDtls)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (exercise) => {
          if (exercise && !this.currentexercise) {
            this.currentexercise = exercise;
            this.startInterval();
          }
        },
      });
  }

  private startInterval(): void {
    if (!this.currentexercise || this.isCompleted) return;
    const step = (this.currentexercise.duration / 100) * 1000;
    this.timer = setInterval(() => {
      this.progress += 1;
      this.checkMilestones();
      if (this.progress >= 100) {
        clearInterval(this.timer!);
        this.timer = null;
        this.handleCompletion();
      }
    }, step);
  }

  private handleCompletion(): void {
    this.isCompleted = true;
    setTimeout(() => {
      this.trainingservice.completeExercise(this.currentexercise).subscribe();
    }, 3000);
  }

  private checkMilestones(): void {
    const milestones: { value: number; freq: number }[] = [
      { value: 50, freq: 440 },
      { value: 75, freq: 660 },
      { value: 100, freq: 880 },
    ];
    for (const m of milestones) {
      if (this.progress >= m.value && !this.playedMilestones.has(m.value)) {
        this.playedMilestones.add(m.value);
        this.playBeep(m.freq, 300);
      }
    }
  }

  private playBeep(frequency: number, durationMs: number): void {
    try {
      if (!this.audioContext) {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.001,
        this.audioContext.currentTime + durationMs / 1000
      );
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + durationMs / 1000);
    } catch {
      // Web Audio API unavailable in this environment
    }
  }

  pauseResume(): void {
    if (this.isPaused) {
      this.isPaused = false;
      this.startInterval();
    } else {
      this.isPaused = true;
      if (this.timer !== null) {
        clearInterval(this.timer);
        this.timer = null;
      }
    }
  }

  stop(): void {
    if (this.timer !== null) {
      clearInterval(this.timer);
      this.timer = null;
    }
    const dialogRef = this.dialog.open(StopTrainingComponent, {
      data: {
        progress: this.progress,
        name: this.currentexercise.name,
        calories: this.currentexercise.calories,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'complete') {
        this.trainingservice.completeExercise(this.currentexercise).subscribe();
      } else if (result) {
        this.trainingservice.cancelExercise(this.currentexercise, this.progress).subscribe();
      } else {
        this.isPaused = false;
        this.startInterval();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.timer !== null) {
      clearInterval(this.timer);
    }
    if (this.audioContext) {
      this.audioContext.close();
    }
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
