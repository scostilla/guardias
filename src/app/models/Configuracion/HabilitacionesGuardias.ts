import { Asistencial } from "./Asistencial";
import { Efector } from "./Efector";
export class HabilitacionesGuardias {
    id?: number;
    activo: boolean;
    asistencial: Asistencial;
    efectores: Efector[];
  
    constructor(
        activo: boolean,
        asistencial: Asistencial,
        efectores: Efector[]    
    ) {
      this.activo = activo;
      this.asistencial = asistencial;
      this.efectores = efectores;
    }
  }
  