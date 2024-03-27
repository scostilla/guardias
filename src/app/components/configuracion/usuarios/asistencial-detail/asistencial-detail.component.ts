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
  }

  cerrar(): void {
    this.dialogRef.close();
  }

}