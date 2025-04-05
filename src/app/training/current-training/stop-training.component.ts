import {Component, Inject} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {MAT_DIALOG_DATA, MatDialogModule} from '@angular/material/dialog';

@Component({
    selector: 'app-stop-training',
    template: `<h1 mat-dialog-title>Are you sure you to stop {{passedData.name}} ?</h1>
              <mat-dialog-content>
                <p>You already got {{passedData.progress}}% </p>
              </mat-dialog-content>
              <mat-dialog-actions>
                <button mat-button [mat-dialog-close]="true">Yes</button>
                <button mat-button [mat-dialog-close]="false">No</button>
              </mat-dialog-actions>
    `,
    standalone: true,
    imports:[MatDialogModule, MatButtonModule]
})
export class StopTrainingComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public passedData) {
  }
}
