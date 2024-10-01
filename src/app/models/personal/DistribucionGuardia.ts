import { Efector } from "../Configuracion/Efector";
import { Asistencial } from 'src/app/models/Configuracion/Asistencial';
import { Servicio } from 'src/app/models/Configuracion/Servicio';
import { DistribucionHoraria } from "./DistribucionHoraria";

export class DistribucionGuardia extends DistribucionHoraria {
    tipoGuardia: string;
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
    tipoGuardia: string,
    servicio: Servicio,
  ) {
    super(dia, cantidadHoras, activo, persona, efector, fechaInicio, fechaFinalizacion, horaIngreso);
    this.tipoGuardia = tipoGuardia;
    this.servicio = servicio;
  }

}