export class HabilitacionesGeneralesDto {
    activo: boolean;
    idPersona: number;
    idEfectores: number[];
    tipoEfectorEx: string[]
    
    
    constructor(
        activo: boolean,
        idPersona: number,
        idEfectores: number[],
        tipoEfectorEx: string[]
    ){
        this.activo = activo;
        this.idPersona = idPersona;
        this.idEfectores = idEfectores;
        this.tipoEfectorEx = tipoEfectorEx
      }
    }
    
    