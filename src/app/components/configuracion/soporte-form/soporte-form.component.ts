import { Component } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-soporte-form',
  templateUrl: './soporte-form.component.html',
  styleUrls: ['./soporte-form.component.css']
})
export class SoporteFormComponent {

  constructor(
    private dialogRef: MatDialogRef<SoporteFormComponent>,
  ) {}

  cancelar(): void {
    this.dialogRef.close();
  }

}
