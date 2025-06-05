import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CronogramaTentativoListAtorizadoDto } from 'src/app/dto/Cronogramas/CronogramaTentativoListAtorizadoDto';
import { HospitalService } from 'src/app/services/Configuracion/hospital.service';
import { EfectorHospitalDto } from 'src/app/dto/Configuracion/efector/EfectorHospitalDto';
import { DistribucionGuardiaService } from 'src/app/services/personal/distribucionGuardia.service';
import { DistribucionGuardia } from 'src/app/models/personal/DistribucionGuardia';

@Component({
  selector: 'app-cronograma-pendiente-detail',
  templateUrl: './cronograma-pendiente-detail.component.html',
  styleUrls: ['./cronograma-pendiente-detail.component.css']
})
export class CronogramaPendienteDetailComponent implements OnInit {

  cronograma!: CronogramaTentativoListAtorizadoDto;
  nombreEfector: string = '';
  distribuciones: DistribucionGuardia[] = [];

  constructor(
    private dialogRef: MatDialogRef<CronogramaPendienteDetailComponent>,
    private hospitalService: HospitalService,
    private distribucionGuardiaService: DistribucionGuardiaService,
    @Inject(MAT_DIALOG_DATA) private data: CronogramaTentativoListAtorizadoDto 
  ) { }

ngOnInit(): void {
  this.cronograma = this.data;

  this.hospitalService.detailNombreAll(this.cronograma.idEfector).subscribe({
    next: (nombre: EfectorHospitalDto) => {
      this.nombreEfector = nombre.nombre;
    },
    error: (err) => {
      console.error('Error obteniendo el nombre del efector', err);
      this.nombreEfector = 'Nombre no disponible';
    }
  });

  const fecha = new Date(this.cronograma.fechaIngreso);
  const mes = fecha.getMonth() + 1; // getMonth es 0-based
  const anio = fecha.getFullYear();
  const idPersona = this.cronograma.asistencial.id;

  this.distribucionGuardiaService.getDistribucionesByActivoPersonaAndFechaInicio(idPersona, mes, anio)
    .subscribe({
      next: (data: DistribucionGuardia[]) => {
        this.distribuciones = data;
      },
      error: (err) => {
        console.error('Error cargando distribuciones:', err);
      }
    });
}

calcularHoraEgreso(horaIngreso: Date, cantidadHoras: number): string {
  const ingreso = new Date(horaIngreso);
  ingreso.setHours(ingreso.getHours() + cantidadHoras);
  return ingreso.toTimeString().split(' ')[0];
}

  cerrar(): void {
    this.dialogRef.close();
  }

}
