    import { Person } from "./Person";
    import { Efector } from "./Efector";
    export class HabilitacionesGenerales {
        id?: number;
        activo: boolean;
        persona: Person;
        efectores: Efector[];
        tipoEfectorEx?: string;

      
        constructor(
            activo: boolean,
            persona: Person,
            efectores: Efector[],
            tipoEfectorEx?: string  
        ) {
          this.activo = activo;
          this.persona = persona;
          this.efectores = efectores;
          this.tipoEfectorEx = tipoEfectorEx
        }
      }
      