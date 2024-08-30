import { Efector } from "./Configuracion/Efector";
import { ValorGuardias } from "./ValorGuardias";

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
    idBonoUti: number,
    idValorGmi: number,
    activo: boolean,
    efectores: Efector[],
    decreto1178Lav: number,
    decreto1178Sdf: number,
    decreto1657Lav: number,
    decreto1657Sdf: number,  
  ) {
    super(fechaInicio, fechaFin, nivelComplejidad, tipoGuardia, totalLav, totalSdf, idBonoUti, idValorGmi, activo, efectores)
    this.decreto1178Lav = decreto1178Lav;
    this.decreto1178Sdf = decreto1178Sdf;
    this.decreto1657Lav = decreto1657Lav;
    this.decreto1657Sdf = decreto1657Sdf;
  }

}