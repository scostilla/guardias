import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';


@Component({
  selector: 'app-prueba-detail',
  templateUrl: './prueba-detail.component.html',
  styleUrls: ['./prueba-detail.component.css']
})
export class PruebaDetailComponent {
  constructor(
    public dialogRef: MatDialogRef<PruebaDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  cerrar(): void {
    this.dialogRef.close();
  }
}