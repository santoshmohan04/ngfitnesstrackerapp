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
import { MatSort } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TrainingService } from '../training.service';
import { CommonModule } from '@angular/common';
import { getAuth, User, onAuthStateChanged } from 'firebase/auth';

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
    CommonModule
  ],
})
export class PastTrainingsComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  displayedColumns: string[] = [
    'date',
    'name',
    'duration',
    'calories',
    'state',
  ];
  dataSource = new MatTableDataSource<Exercise>();
  trainingservice = inject(TrainingService);
  authSubscription: Subscription | null = null
  auth = getAuth();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit(): void {
    this.authSubscription = new Subscription();
    const authUnsubscribe = onAuthStateChanged(this.auth, (user: User | null) => {
      if (user) {
        this.getItems();
      } else {
        this.dataSource.data = []; // Clear observable
      }
    });
    this.authSubscription.add(authUnsubscribe);
  }

  getItems(){
    this.trainingservice.getCompletedOrCancelledExercises().subscribe({
      next: (exercises: Exercise[]) => {
        this.dataSource.data = [...exercises]
      },
      error: (error) => {
        console.error('Error fetching finished trainings', error);
      },
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  doFilter(value: string) {
    this.dataSource.filter = value.trim().toLowerCase();
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }
}
