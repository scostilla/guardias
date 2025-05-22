import { Asistencial } from "./Asistencial";
import { Efector } from "./Efector";
export class HabilitacionesGuardias {
    id?: number;
    activo: boolean;
    asistencial: Asistencial;
    efectores: Efector[];
    tipoEfectorEx?: string;
  
    constructor(
        activo: boolean,
        asistencial: Asistencial,
        efectores: Efector[],
        tipoEfectorEx?: string,
    ) {
      this.activo = activo;
      this.asistencial = asistencial;
      this.efectores = efectores;
      this.tipoEfectorEx = tipoEfectorEx
    }
  }
  