export class CronogramaTentativoDto {

    fechaIngreso: Date;  
    fechaEgreso: Date; 
    horaIngreso: Date;
    horaEgreso: Date;
    activo: boolean;
    aceptado: boolean;
    idTipoGuardia: number;
    idAsistencial: number;
    idEfector: number;
    observacion: string

    constructor(
        fechaIngreso: Date,  
        fechaEgreso: Date, 
        horaIngreso: Date,
        horaEgreso: Date,
        activo: boolean,
        aceptado: boolean,
        idTipoGuardia: number,
        idAsistencial: number,
        idEfector: number,
        observacion: string    
    ) {
        this.fechaIngreso = fechaIngreso;
        this.fechaEgreso = fechaEgreso;
        this.horaIngreso = horaIngreso;
        this.horaEgreso = horaEgreso;
        this.activo = activo;
        this.aceptado = aceptado;
        this.idTipoGuardia = idTipoGuardia;
        this.idAsistencial = idAsistencial;
        this.idEfector = idEfector;
        this.observacion = observacion;
      }
  
  };
  