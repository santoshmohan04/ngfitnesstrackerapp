import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { UiService } from 'src/app/shared/ui.service';

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
  ],
})
export class SignupComponent implements OnInit {
  store = inject(Store);
  maxDate: Date;
  hide: boolean = true;
  isLoading: boolean = false;
  router = inject(Router);
  auth = getAuth();
  uiservice = inject(UiService);

  ngOnInit(): void {
    this.maxDate = new Date();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 16);
  }

  submitForm(f: NgForm) {
    if (f.form.invalid) {
      return;
    }
    this.isLoading = true;
    const formValues = f.form.value;
    const { email, password } = formValues;
    createUserWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
        // Signed in
        this.isLoading = false;
        const user = userCredential.user;
        console.log('User logged in:', user);
        this.router.navigate(['/training']);
      })
      .catch((error) => {
        this.isLoading = false;
        this.uiservice.showSnackbar(error.message, null, 3000);
        console.error('Login failed:', error);
      });
  }
}
