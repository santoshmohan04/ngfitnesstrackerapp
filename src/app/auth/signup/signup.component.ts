import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { authdata } from '../auth.actions';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatButtonModule,
    FlexLayoutModule,
    CommonModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
  ],
})
export class SignupComponent implements OnInit {
  store = inject(Store);
  maxDate: Date;
  hide: boolean = true;
  isLoading: boolean = false;
  router = inject(Router);

  ngOnInit(): void {
    this.maxDate = new Date();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 16);

    // Subscribe to auth loading state
    this.store.select((state: any) => state.auth?.isLoading)
      .subscribe((loading) => {
        this.isLoading = loading;
      });
  }

  submitForm(f: NgForm) {
    if (f.form.invalid) {
      return;
    }
    const formValues = f.form.value;
    const { email, password, firstName, lastName } = formValues;
    this.store.dispatch(authdata.signup({ email, password, firstName, lastName }));
  }
}
