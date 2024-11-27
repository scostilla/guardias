    import { Person } from "./Person";
    import { Efector } from "./Efector";
    export class HabilitacionesGenerales {
        id?: number;
        activo: boolean;
        persona: Person;
        efectores: Efector[];
      
        constructor(
            activo: boolean,
            persona: Person,
            efectores: Efector[]    
        ) {
          this.activo = activo;
          this.persona = persona;
          this.efectores = efectores;
        }
      }
      