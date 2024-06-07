import {Subject} from 'rxjs';
import {Injectable} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';

@Injectable()
export class UiService{
  loadingStateChanged : Subject<boolean> = new Subject();

  constructor(private snackbar: MatSnackBar) {
  }

  showSnackbar(message, action, duration) {
    this.snackbar.open(message, action, {
      duration: duration
    });
  }
 }
