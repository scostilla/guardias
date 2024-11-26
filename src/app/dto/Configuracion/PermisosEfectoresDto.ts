export class PermisosEfectoresDto {
    activo: boolean;
    idPersona: number;
    idEfectores: number[]
    
    constructor(
        activo: boolean,
        idPersona: number,
        idEfectores: number[]    
    ){
        this.activo = activo;
        this.idPersona = idPersona;
        this.idEfectores = idEfectores
      }
    }
    
    
