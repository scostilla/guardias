export class DistribucionesConCronogramasDto {
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
    this.tipoGuardia = tipoGuardia;
    this.idServicio = idServicio;
  }

}