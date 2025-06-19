export class HabilitacionesGuardiasDto {
    activo: boolean;
    idAsistencial: number;
    idEfectores: number[];
  /*   tipoEfectorEx: string[] */
    
    constructor(
        activo: boolean,
        idAsistencial: number,
        idEfectores: number[],
       /*  tipoEfectorEx: string[] */
    ){
        this.activo = activo;
        this.idAsistencial = idAsistencial;
        this.idEfectores = idEfectores;
       /*  this.tipoEfectorEx = tipoEfectorEx */
      }
    }
    
    