import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NovedadPersonal } from 'src/app/models/personal/NovedadPersonal';
import * as moment from 'moment';

@Component({
  selector: 'app-novedades-person-detail',
  templateUrl: './novedades-person-detail.component.html',
  styleUrls: ['./novedades-person-detail.component.css']
})
export class NovedadesPersonDetailComponent implements OnInit {

  novedadPeronal!: NovedadPersonal;

  constructor(
    private dialogRef: MatDialogRef<NovedadesPersonDetailComponent>,
    @Inject(MAT_DIALOG_DATA) private data: NovedadPersonal 
  ) { }

  ngOnInit(): void {
    this.novedadPeronal = this.data;
    
    // Verificar que las horas sean cadenas de texto antes de formatearlas
    if (this.novedadPeronal.horaInicio) {
      // Asegurarse de que horaInicio sea una cadena de texto con el formato correcto
      this.novedadPeronal.horaInicio = moment(this.novedadPeronal.horaInicio, 'HH:mm:ss').format('HH:mm');
    }
    if (this.novedadPeronal.horaFinal) {
      // Asegurarse de que horaFinal sea una cadena de texto con el formato correcto
      this.novedadPeronal.horaFinal = moment(this.novedadPeronal.horaFinal, 'HH:mm:ss').format('HH:mm');
    }
  }
  
  cerrar(): void {
    this.dialogRef.close();
  }

}