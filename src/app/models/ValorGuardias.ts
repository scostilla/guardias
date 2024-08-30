import { Efector } from "./Configuracion/Efector";

export class ValorGuardias {
  id?: number;
  fechaInicio: Date;
  fechaFin: Date;
  nivelComplejidad: number;
  tipoGuardia: string;
  totalLav: number;
  totalSdf: number;
  idBonoUti: number;
  idValorGmi: number;
  activo: boolean;
  efectores: Efector[];

  constructor(

    fechaInicio: Date,
    fechaFin: Date,
    nivelComplejidad: number,
    tipoGuardia: string,
    totalLav: number,
    totalSdf: number,
    idBonoUti: number,
    idValorGmi: number,
    activo: boolean,
    efectores: Efector[],
  ) {
    this.fechaInicio = fechaInicio;
    this.fechaFin = fechaFin;
    this.nivelComplejidad = nivelComplejidad;
    this.tipoGuardia = tipoGuardia;
    this.totalLav = totalLav;
    this.totalSdf = totalSdf;
    this.idBonoUti = idBonoUti;
    this.idValorGmi = idValorGmi;
    this.activo = activo;
    this.efectores = efectores;
  }

}