import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Especialidad } from 'src/app/models/Configuracion/Especialidad';

@Component({
  selector: 'app-especialidad-detail',
  templateUrl: './especialidad-detail.component.html',
  styleUrls: ['./especialidad-detail.component.css']
})
export class EspecialidadDetailComponent implements OnInit {

  especialidad!: Especialidad;

  constructor(
    private dialogRef: MatDialogRef<EspecialidadDetailComponent>,
    @Inject(MAT_DIALOG_DATA) private data: Especialidad 
  ) { }

  ngOnInit(): void {
    this.especialidad = this.data;
  }

  cerrar(): void {
    this.dialogRef.close();
  }

}