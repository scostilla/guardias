import { DistribucionHorariaDto } from "./DistribucionHorariaDto";

export class DistribucionOtroDto extends DistribucionHorariaDto {
    descripcion: string;
    lugar: string;
    tipo: string;

  constructor(

    dia: string,
    cantidadHoras: number,
    idPersona: number,
    idEfector: number,
    fechaInicio: Date,
    fechaFinalizacion: Date,
    horaIngreso: Date,
    descripcion: string,
    lugar: string,
    tipo: string
  ) {
    super(dia, cantidadHoras, idPersona, idEfector, fechaInicio, fechaFinalizacion, horaIngreso);
    this.descripcion = descripcion;
    this.lugar = lugar;
    this.tipo = tipo;
  }

}