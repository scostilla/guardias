export class DistribucionHorariaDto {
    dia: string;
    cantidadHoras: number;
    idPersona: number;
    idEfector: number;
    fechaInicio: Date;
    fechaFinalizacion: Date;
    horaIngreso: Date;

  constructor(

    dia: string,
    cantidadHoras: number,
    idPersona: number,
    idEfector: number,
    fechaInicio: Date,
    fechaFinalizacion: Date,
    horaIngreso: Date,
  ) {
    this.dia = dia;
    this.cantidadHoras = cantidadHoras;
    this.idPersona = idPersona;
    this.idEfector = idEfector;
    this.fechaInicio = fechaInicio;
    this.fechaFinalizacion = fechaFinalizacion;
    this.horaIngreso = horaIngreso;
  }

}