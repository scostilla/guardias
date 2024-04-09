import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';

@Component({
  selector: 'app-cronograma-detail',
  templateUrl: './cronograma-detail.component.html',
  styleUrls: ['./cronograma-detail.component.css']
})
export class CronogramaDetailComponent {
  constructor(
    public dialogRef: MatDialogRef<CronogramaDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  cerrar(): void {
    this.dialogRef.close();
  }

}