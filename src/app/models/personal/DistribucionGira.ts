import { Efector } from "../Configuracion/Efector";
import { Asistencial } from 'src/app/models/Configuracion/Asistencial';
import { DistribucionHoraria } from "./DistribucionHoraria";

export class DistribucionGira extends DistribucionHoraria {
    puestoSalud: string;

  constructor(

    dia: string,
    cantidadHoras: number,
    activo: boolean,
    persona: Asistencial,
    efector: Efector,
    fechaInicio: Date,
    fechaFinalizacion: Date,
    horaIngreso: Date,
    puestoSalud: string,
  ) {
    super(dia, cantidadHoras, activo, persona, efector, fechaInicio, fechaFinalizacion, horaIngreso);
    this.puestoSalud = puestoSalud;
  }

}