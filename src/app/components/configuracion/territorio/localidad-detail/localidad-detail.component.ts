import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Localidad } from 'src/app/models/Configuracion/Localidad';

@Component({
  selector: 'app-localidad-detail',
  templateUrl: './localidad-detail.component.html',
  styleUrls: ['./localidad-detail.component.css']
})
export class LocalidadDetailComponent implements OnInit {

  localidad!: Localidad;

  constructor(
    private dialogRef: MatDialogRef<LocalidadDetailComponent>,
    @Inject(MAT_DIALOG_DATA) private data: Localidad 
  ) { }

  ngOnInit(): void {
    this.localidad = this.data;
  }

  cerrar(): void {
    this.dialogRef.close();
  }

}