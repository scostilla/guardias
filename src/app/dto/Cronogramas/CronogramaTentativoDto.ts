export class CronogramaTentativoDto {

    fechaIngreso: Date;  
    fechaEgreso: Date; 
    horaIngreso: Date;
    horaEgreso: Date;
    activo: boolean;
    aceptado: boolean;
    autorizado: boolean;
    idTipoGuardia: number;
    idAsistencial: number;
    idServicio: number;
    idEfector: number;
    observacion: string | null

    constructor(
        fechaIngreso: Date,  
        fechaEgreso: Date, 
        horaIngreso: Date,
        horaEgreso: Date,
        activo: boolean,
        aceptado: boolean,
        autorizado: boolean,
        idTipoGuardia: number,
        idAsistencial: number,
        idServicio: number,
        idEfector: number,
        observacion: string | null    
    ) {
        this.fechaIngreso = fechaIngreso;
        this.fechaEgreso = fechaEgreso;
        this.horaIngreso = horaIngreso;
        this.horaEgreso = horaEgreso;
        this.activo = activo;
        this.aceptado = aceptado;
        this.autorizado = autorizado;
        this.idTipoGuardia = idTipoGuardia;
        this.idAsistencial = idAsistencial;
        this.idServicio = idServicio;
        this.idEfector = idEfector;
        this.observacion = observacion;
      }
  
  };
  