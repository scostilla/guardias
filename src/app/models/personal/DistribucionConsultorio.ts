import { Efector } from "../Configuracion/Efector";
import { Asistencial } from 'src/app/models/Configuracion/Asistencial';
import { Servicio } from 'src/app/models/Configuracion/Servicio';
import { DistribucionHoraria } from "./DistribucionHoraria";

export class DistribucionConsultorio extends DistribucionHoraria {
    tipoConsultorio: string;
    lugar: string;
    servicio: Servicio;

  constructor(

    dia: string,
    cantidadHoras: number,
    activo: boolean,
    persona: Asistencial,
    efector: Efector,
    fechaInicio: Date,
    fechaFinalizacion: Date,
    horaIngreso: Date,
    tipoConsultorio: string,
    lugar: string,
    servicio: Servicio,
  ) {
    super(dia, cantidadHoras, activo, persona, efector, fechaInicio, fechaFinalizacion, horaIngreso);
    this.tipoConsultorio = tipoConsultorio;
    this.lugar = lugar;
    this.servicio = servicio;
  }

}