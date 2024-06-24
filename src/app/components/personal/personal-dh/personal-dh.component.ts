import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Asistencial } from 'src/app/models/Configuracion/Asistencial';
import { AsistencialService } from 'src/app/services/Configuracion/asistencial.service';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import 'moment/locale/es';


@Component({
  selector: 'app-personal-dh',
  templateUrl: './personal-dh.component.html',
  styleUrls: ['./personal-dh.component.css']
})

export class PersonalDhComponent implements OnInit, OnDestroy {
  suscription!: Subscription;

  asistencial!: Asistencial;
  nombreMes!: string;
  anoActual!: number;

  constructor(
    private asistencialService: AsistencialService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const asistencialId = params['id'];
      this.getAsistencialData(asistencialId);
    });

    const fechaActual = moment();

    this.nombreMes = this.getMonthName(fechaActual.month());
    this.anoActual = fechaActual.year();
  }
  
  getAsistencialData(id: number): void {
    this.asistencialService.detail(id).subscribe(
      (data: Asistencial) => {
        this.asistencial = data; // Asigna los datos a la propiedad asistencial
      },
      error => {
        console.error('Error al obtener datos de asistencial:', error);
      }
    );
  }
  
  getMonthName(monthIndex: number): string {
    const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    return monthNames[monthIndex];
  }

  accentFilter(input: string): string {
    const acentos = "ÁÉÍÓÚáéíóú";
    const original = "AEIOUaeiou";
    let output = "";
    for (let i = 0; i < input.length; i++) {
      const index = acentos.indexOf(input[i]);
      if (index >= 0) {
        output += original[index];
      } else {
        output += input[i];
      }
    }
    return output;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    /*this.dataSource.filterPredicate = (data: RegistroMensual, filter: string) => {
      const nombre = this.accentFilter(data.asistencial.nombre.toLowerCase());
      const apellido = this.accentFilter(data.asistencial.apellido.toLowerCase());

      filter = this.accentFilter(filter.toLowerCase());
      return nombre.includes(filter) || apellido.includes(filter);
    };
    this.dataSource.filter = filterValue.trim().toLowerCase();*/
  }

  ngOnDestroy(): void {
    this.suscription?.unsubscribe();
  }

}
