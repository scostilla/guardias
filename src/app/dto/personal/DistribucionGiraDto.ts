import { DistribucionHorariaDto } from "./DistribucionHorariaDto";

export class DistribucionGiraDto extends DistribucionHorariaDto {
    puestoSalud: string;
    descripcion: string;
    destino: string;


  constructor(

    dia: string,
    cantidadHoras: number,
    idPersona: number,
    idEfector: number,
    fechaInicio: Date,
    fechaFinalizacion: Date,
    horaIngreso: Date,
    puestoSalud: string,
    descripcion: string,
    destino: string,
  ) {
    super(dia, cantidadHoras, idPersona, idEfector, fechaInicio, fechaFinalizacion, horaIngreso);
    this.puestoSalud = puestoSalud;
    this.descripcion = descripcion;
    this.destino = destino;
  }

}