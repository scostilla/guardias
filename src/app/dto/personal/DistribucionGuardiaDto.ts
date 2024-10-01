import { DistribucionHorariaDto } from "./DistribucionHorariaDto";

export class DistribucionGuardiaDto extends DistribucionHorariaDto {
    tipoGuardia: string;
    idServicio: number;

  constructor(

    dia: string,
    cantidadHoras: number,
    idPersona: number,
    idEfector: number,
    fechaInicio: Date,
    fechaFinalizacion: Date,
    horaIngreso: Date,
    tipoGuardia: string,
    idServicio: number
  ) {
    super(dia, cantidadHoras, idPersona, idEfector, fechaInicio, fechaFinalizacion, horaIngreso);
    this.tipoGuardia = tipoGuardia;
    this.idServicio = idServicio;
  }

}