export class PermisosDto {

    activo: boolean;
    idAsistencial: number;
    idEfectores: number[]
    
    constructor(
        activo: boolean,
        idAsistencial: number,
        idEfectores: number[]    
    ){
        this.activo = activo;
        this.idAsistencial = idAsistencial;
        this.idEfectores = idEfectores
      }
    }
    
    
