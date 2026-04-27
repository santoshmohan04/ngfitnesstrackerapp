import {
  AfterViewInit,
  Component,
  inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Exercise } from '../exercise.model';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TrainingService } from '../training.service';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { EditExerciseDialogComponent } from './edit-exercise-dialog.component';
import { DeleteExerciseDialogComponent } from './delete-exercise-dialog.component';
import { SkeletonLoaderComponent } from 'src/app/shared/skeleton-loader/skeleton-loader.component';

@Component({
  selector: 'app-past-trainings',
  templateUrl: './past-trainings.component.html',
  styleUrls: ['./past-trainings.component.scss'],
  standalone: true,
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    FlexLayoutModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatChipsModule,
    MatIconModule,
    MatButtonModule,
    CommonModule,
    SkeletonLoaderComponent,
  ],
})
export class PastTrainingsComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  displayedColumns: string[] = ['date', 'name', 'duration', 'calories', 'state', 'actions'];
  dataSource = new MatTableDataSource<Exercise>();
  trainingservice = inject(TrainingService);
  private readonly dialog = inject(MatDialog);
  exerciseSubscription: Subscription | null = null;
  isLoading = false;
  fromDate: Date | null = null;
  toDate: Date | null = null;
  private filterText = '';

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.dataSource.filterPredicate = (data: Exercise, filter: string) => {
      const trimmedFilter = filter.trim();
      const matchesText =
        !trimmedFilter ||
        Object.values(data).some(
          (val) =>
            val !== null &&
            val !== undefined &&
            String(val).toLowerCase().includes(trimmedFilter),
        );
      const rowDate = data.date ? new Date(data.date) : null;
      const matchesFrom =
        !this.fromDate || (rowDate !== null && rowDate >= this.fromDate);
      let matchesTo = true;
      if (this.toDate && rowDate) {
        const toDateEnd = new Date(this.toDate);
        toDateEnd.setHours(23, 59, 59, 999);
        matchesTo = rowDate <= toDateEnd;
      }
      return matchesText && matchesFrom && matchesTo;
    };
    this.getItems();
  }

  getItems() {
    this.isLoading = true;
    this.exerciseSubscription = this.trainingservice
      .getCompletedOrCancelledExercises()
      .subscribe({
        next: (exercises: Exercise[]) => {
          this.dataSource.data = [...exercises];
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error fetching finished trainings', error);
          this.isLoading = false;
        },
      });
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  doFilter(event: Event) {
    this.filterText = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.triggerFilter();
  }

  applyDateFilter() {
    this.triggerFilter();
  }

  private triggerFilter() {
    this.dataSource.filter =
      this.filterText || (this.fromDate || this.toDate ? ' ' : '');
  }

  onEdit(exercise: Exercise) {
    const dialogRef = this.dialog.open(EditExerciseDialogComponent, {
      data: exercise,
      width: '400px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result && exercise.id) {
        this.trainingservice
          .updateFinishedExercise(exercise.id, result)
          .subscribe({
            next: () => this.getItems(),
            error: (err) => console.error('Error updating exercise', err),
          });
      }
    });
  }

  onDelete(exercise: Exercise) {
    const dialogRef = this.dialog.open(DeleteExerciseDialogComponent, {
      data: { name: exercise.name },
    });
    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed && exercise.id) {
        this.trainingservice.deleteFinishedExercise(exercise.id).subscribe({
          next: () => {
            this.dataSource.data = this.dataSource.data.filter(
              (e) => e.id !== exercise.id,
            );
          },
          error: (err) => console.error('Error deleting exercise', err),
        });
      }
    });
  }

  ngOnDestroy(): void {
    if (this.exerciseSubscription) {
      this.exerciseSubscription.unsubscribe();
    }
  }
}
