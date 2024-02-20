import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Profesion } from 'src/app/models/Profesion';

@Component({
  selector: 'app-prueba-detail',
  templateUrl: './prueba-detail.component.html',
  styleUrls: ['./prueba-detail.component.css']
})
export class PruebaDetailComponent implements OnInit {

  // Profesión que se muestra en el detalle
  profesion!: Profesion;

  constructor(
    private dialogRef: MatDialogRef<PruebaDetailComponent>,
    @Inject(MAT_DIALOG_DATA) private data: Profesion // Inyectar los datos de la profesión
  ) { }

  ngOnInit(): void {
    // Asignar la profesión recibida a la variable local
    this.profesion = this.data;
  }

  // Método para cerrar el diálogo
  cerrar(): void {
    this.dialogRef.close();
  }

}