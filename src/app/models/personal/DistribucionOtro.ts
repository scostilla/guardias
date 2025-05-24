import { Efector } from "../Configuracion/Efector";
import { Asistencial } from 'src/app/models/Configuracion/Asistencial';
import { DistribucionHoraria } from "./DistribucionHoraria";

export class DistribucionOtro extends DistribucionHoraria {
    descripcion: string;
    lugar: string;
    tipo: string;

  constructor(

    dia: string,
    cantidadHoras: number,
    activo: boolean,
    persona: Asistencial,
    efector: Efector,
    fechaInicio: Date,
    fechaFinalizacion: Date,
    horaIngreso: Date,
    descripcion: string,
    lugar: string,
    tipo: string
  ) {
    super(dia, cantidadHoras, activo, persona, efector, fechaInicio, fechaFinalizacion, horaIngreso);
    this.descripcion = descripcion;
    this.lugar = lugar;
    this.tipo = tipo;
  }

}