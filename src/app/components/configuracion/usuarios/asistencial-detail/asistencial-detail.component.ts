import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Asistencial } from 'src/app/models/Configuracion/Asistencial';

@Component({
  selector: 'app-asistencial-detail',
  templateUrl: './asistencial-detail.component.html',
  styleUrls: ['./asistencial-detail.component.css']
})
export class AsistencialDetailComponent implements OnInit {

  asistencial!: Asistencial;

  constructor(
    private dialogRef: MatDialogRef<AsistencialDetailComponent>,
    @Inject(MAT_DIALOG_DATA) private data: Asistencial 
  ) { }

  ngOnInit(): void {
    this.asistencial = this.data;
    this.asistencial.cuil = this.formatearCuil(this.asistencial.cuil);
  }

  cerrar(): void {
    this.dialogRef.close();
  }

  formatearCuil(cuil: string): string {
    if (cuil && cuil.length === 11) {
      return `${cuil.slice(0, 2)}-${cuil.slice(2, 10)}-${cuil.slice(10)}`;
    }
    return cuil;
  }

}