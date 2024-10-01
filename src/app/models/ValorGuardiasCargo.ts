import { Efector } from "./Configuracion/Efector";
import { ValorGuardias } from "./ValorGuardias";
import { ValorGmi } from 'src/app/models/ValorGmi';
import { ValorBonoUti } from 'src/app/models/ValorBonoUti';

export class ValorGuardiasCargo extends ValorGuardias {
  decreto1178Lav: number;
  decreto1178Sdf: number;
  decreto1657Lav: number;
  decreto1657Sdf: number;


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
    decreto1178Lav: number,
    decreto1178Sdf: number,
    decreto1657Lav: number,
    decreto1657Sdf: number,  
  ) {
    super(fechaInicio, fechaFin, nivelComplejidad, tipoGuardia, totalLav, totalSdf, bonoUti, bono1580Lav, bono1580Sdf, valorGmi, activo, efectores)
    this.decreto1178Lav = decreto1178Lav;
    this.decreto1178Sdf = decreto1178Sdf;
    this.decreto1657Lav = decreto1657Lav;
    this.decreto1657Sdf = decreto1657Sdf;
  }

}