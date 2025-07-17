import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Person } from 'src/app/models/Configuracion/Person';
import { RegistroMensual } from 'src/app/models/RegistroMensual';
import { NovedadPersonal } from 'src/app/models/guardias/NovedadPersonal';
import { NovedadPersonalService } from 'src/app/services/personal/novedadPersonal.service';
import { LegajoService } from 'src/app/services/Configuracion/legajo.service';
import { LegajoActualDto } from 'src/app/dto/Configuracion/asistencial/LegajoActualDto';
import * as moment from 'moment';

@Component({
  selector: 'app-rmensual-cargoyagrup-detail',
  templateUrl: './rmensual-cargoyagrup-detail.component.html',
  styleUrls: ['./rmensual-cargoyagrup-detail.component.css']
})
export class RmensualCargoyagrupDetailComponent implements OnInit {
  asistencial!: Person;
  month: number;
  year: number;
  registroMensual!: RegistroMensual;
  novedadesActivas: NovedadPersonal[] = [];
  legajoActual!: LegajoActualDto | null;

  constructor(
    public dialogRef: MatDialogRef<RmensualCargoyagrupDetailComponent>,
    private novedadPersonalService: NovedadPersonalService,
    private legajoService: LegajoService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.asistencial = data.asistencial;
    this.month = data.month;
    this.year = data.year;
  }

  ngOnInit(): void {
    this.cargarLegajoActual();
    this.cargarNovedadesActivas();
  }

  private cargarLegajoActual(): void {
    this.legajoService.listByAsistencial(this.asistencial.id!).subscribe({
      next: legajos => {
        this.legajoActual = legajos[0] ?? null;
      },
      error: err => {
        console.error('Error al obtener legajo actual:', err);
        this.legajoActual = null;
      }
    });
  }

  private cargarNovedadesActivas(): void {
    const mes = Number(this.month);
    const anio = this.year;

    this.novedadPersonalService.getNovedadesActivasPorPersonaYFecha(this.asistencial.id!, mes, anio).subscribe({
      next: novedades => {
        this.novedadesActivas = novedades;
      },
      error: err => {
        console.error('Error al obtener novedades activas:', err);
        this.novedadesActivas = [];
      }
    });
  }

  cerrar(): void {
    this.dialogRef.close();
  }

  formatDate(startDate: Date, endDate: Date): string {
    const formattedStartDate = moment(startDate).format('DD/MM/YYYY');
    const formattedEndDate = moment(endDate).format('DD/MM/YYYY');
  
    if (formattedStartDate === formattedEndDate) {
      return formattedStartDate;
    } else {
      return `${formattedStartDate} - ${formattedEndDate}`;
    }
  }
}