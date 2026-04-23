import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Servicio } from "src/app/models/Configuracion/Servicio";
import { ServicioService } from "src/app/services/Configuracion/servicio.service";

@Component({
  selector: 'app-servicio-detail',
  templateUrl: './servicio-detail.component.html',
  styleUrls: ['./servicio-detail.component.css']
})
export class ServicioDetailComponent implements OnInit {
  servicio!: Servicio;

  constructor(
    private dialogRef: MatDialogRef<ServicioDetailComponent>,
    @Inject(MAT_DIALOG_DATA) private data: Servicio,
    private servicioService: ServicioService
  ) {}

  ngOnInit(): void {
   this.servicio = this.data;
  }

  cerrar(): void {
    this.dialogRef.close();
  }
}
