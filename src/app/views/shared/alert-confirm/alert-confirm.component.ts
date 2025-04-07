import { Component } from '@angular/core';
import {MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
@Component({
    selector: 'app-alert-confirm',
    imports: [MatDialogModule, MatButtonModule],
    templateUrl: './alert-confirm.component.html',
    styleUrl: './alert-confirm.component.scss'
})
export class AlertConfirmComponent {

  constructor(
    public dialogRef: MatDialogRef<AlertConfirmComponent>,
  ){}

}
