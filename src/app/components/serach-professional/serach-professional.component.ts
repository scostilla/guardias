import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-serach-professional',
  templateUrl: './serach-professional.component.html',
  styleUrls: ['./serach-professional.component.css'],
})
export class SerachProfessionalComponent {
  constructor(private dialogRef: MatDialogRef<SerachProfessionalComponent>) {}

  close() {
    this.dialogRef.close();
  }
}
