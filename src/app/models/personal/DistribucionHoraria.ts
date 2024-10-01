import { Efector } from "../Configuracion/Efector";
import { Asistencial } from 'src/app/models/Configuracion/Asistencial';

export class DistribucionHoraria {
    id?: number;
    dia: string;
    cantidadHoras: number;
    activo: boolean;
    persona: Asistencial;
    efector: Efector;
    fechaInicio: Date;
    fechaFinalizacion: Date;
    horaIngreso: Date;

  constructor(

    dia: string,
    cantidadHoras: number,
    activo: boolean,
    persona: Asistencial,
    efector: Efector,
    fechaInicio: Date,
    fechaFinalizacion: Date,
    horaIngreso: Date,
  ) {
    this.dia = dia;
    this.cantidadHoras = cantidadHoras;
    this.activo = activo;
    this.persona = persona;
    this.efector = efector;
    this.fechaInicio = fechaInicio;
    this.fechaFinalizacion = fechaFinalizacion;
    this.horaIngreso = horaIngreso;
  }

}