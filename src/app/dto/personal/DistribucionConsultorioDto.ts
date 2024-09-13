import { DistribucionHorariaDto } from "./DistribucionHorariaDto";

export class DistribucionConsultorioDto extends DistribucionHorariaDto {
    idServicio: number;
    tipoConsultorio: string;
    lugar: string;

  constructor(

    dia: string,
    cantidadHoras: number,
    idPersona: number,
    idEfector: number,
    fechaInicio: Date,
    fechaFinalizacion: Date,
    horaIngreso: Date,
    idServicio: number,
    tipoConsultorio: string,
    lugar: string
  ) {
    super(dia, cantidadHoras, idPersona, idEfector, fechaInicio, fechaFinalizacion, horaIngreso);
    this.idServicio = idServicio;
    this.tipoConsultorio = tipoConsultorio;
    this.lugar = lugar;
  }

}