import { Efector } from "./Configuracion/Efector";
import { ValorGmi } from 'src/app/models/ValorGmi';
import { ValorBonoUti } from 'src/app/models/ValorBonoUti';

export class ValorGuardias {
  id?: number;
  fechaInicio: Date;
  fechaFin: Date;
  nivelComplejidad: number;
  tipoGuardia: string;
  totalLav: number;
  totalSdf: number;
  bonoUti: ValorBonoUti;
  bono1580Lav: number;
  bono1580Sdf: number;
  valorGmi: ValorGmi;
  activo: boolean;
  efectores: string[];

  constructor(

    fechaInicio: Date,
    fechaFin: Date,
    nivelComplejidad: number,
    tipoGuardia: string,
    totalLav: number,
    totalSdf: number,
    bonoUti: ValorBonoUti,
    bono1580Lav: number,
    bono1580Sdf: number,
    valorGmi: ValorGmi,
    activo: boolean,
    efectores: string[],
  ) {
    this.fechaInicio = fechaInicio;
    this.fechaFin = fechaFin;
    this.nivelComplejidad = nivelComplejidad;
    this.tipoGuardia = tipoGuardia;
    this.totalLav = totalLav;
    this.totalSdf = totalSdf;
    this.bonoUti = bonoUti;
    this.bono1580Lav = bono1580Lav;
    this.bono1580Sdf = bono1580Sdf;
    this.valorGmi = valorGmi;
    this.activo = activo;
    this.efectores = efectores;
  }

}