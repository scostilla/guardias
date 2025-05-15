import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CronogramaTentativoListAtorizadoDto } from 'src/app/dto/Cronogramas/CronogramaTentativoListAtorizadoDto';
import { HospitalService } from 'src/app/services/Configuracion/hospital.service';
import { EfectorHospitalDto } from 'src/app/dto/Configuracion/efector/EfectorHospitalDto';

@Component({
  selector: 'app-cronograma-pendiente-detail',
  templateUrl: './cronograma-pendiente-detail.component.html',
  styleUrls: ['./cronograma-pendiente-detail.component.css']
})
export class CronogramaPendienteDetailComponent implements OnInit {

  cronograma!: CronogramaTentativoListAtorizadoDto;
  nombreEfector: string = '';

  constructor(
    private dialogRef: MatDialogRef<CronogramaPendienteDetailComponent>,
    private hospitalService: HospitalService,
    @Inject(MAT_DIALOG_DATA) private data: CronogramaTentativoListAtorizadoDto 
  ) { }

ngOnInit(): void {
  this.cronograma = this.data;

  // Llamada al servicio para obtener el nombre del efector
  this.hospitalService.detailNombreAll(this.cronograma.idEfector).subscribe({
    next: (nombre: EfectorHospitalDto) => {
      this.nombreEfector = nombre.nombre;
    },
    error: (err) => {
      console.error('Error obteniendo el nombre del efector', err);
      this.nombreEfector = 'Nombre no disponible';
    }
  });
}

  cerrar(): void {
    this.dialogRef.close();
  }

}
