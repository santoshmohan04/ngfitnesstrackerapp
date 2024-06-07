import {Component,  OnInit} from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import {AuthService} from '../auth.service';
import {Observable} from 'rxjs';
import {Store} from '@ngrx/store';
import * as fromRoot from '../../app.reducer';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm : UntypedFormGroup;
  hide : Boolean = true;
  isLoading$ : Observable<boolean>;

  constructor(
    private authService : AuthService,
    private store : Store<fromRoot.State>
    ) {}

  ngOnInit(): void {
    this.isLoading$ = this.store.select(fromRoot.getIsLoading);
    // this.loadingStateSubscription = this.uiService.loadingStateChanged.subscribe(state => this.isLoading=state);
    this.loginForm = new UntypedFormGroup({
      email : new UntypedFormControl('',[Validators.required,Validators.email]),
      password : new UntypedFormControl('',[Validators.required])
    });
  }

  onSubmit() {
    const {email,password} = this.loginForm.value;
    this.authService.login({email,password});
  }

}
