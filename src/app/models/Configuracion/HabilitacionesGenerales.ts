    import { Efector } from "./Efector";
import { Person } from "./Person";
    export class HabilitacionesGenerales {
        id?: number;
        activo: boolean;
        persona: Person;
        efectores: Efector[];
        /* tipoEfectorEx?: string; */

      
        constructor(
            activo: boolean,
            persona: Person,
            efectores: Efector[],
            /* tipoEfectorEx?: string   */
        ) {
          this.activo = activo;
          this.persona = persona;
          this.efectores = efectores;
          /* this.tipoEfectorEx = tipoEfectorEx */
        }
      }
      