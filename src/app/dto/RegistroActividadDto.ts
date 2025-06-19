export class RegistroActividadDto{
    fechaIngreso: Date;
    fechaEgreso: Date;
    horaIngreso: Date;
    horaEgreso: Date;
    idTipoGuardia: number;
    activo: boolean;
    idAsistencial: number;
    idServicio: number;
    idEfector: number;
    idUsuarioIngreso: number;
    idUsuarioEgreso: number | null;

    constructor(fechaIngreso: Date, fechaEgreso: Date, horaIngreso: Date, horaEgreso: Date, idTipoGuardia: number, activo: boolean, idAsistencial: number, idServicio: number, idEfector: number, idUsuarioIngreso: number, idUsuarioEgreso?: number | null) {

        this.fechaIngreso = fechaIngreso; 
        this.fechaEgreso = fechaEgreso;
        this.horaIngreso = horaIngreso;
        this.horaEgreso = horaEgreso;
        this.idTipoGuardia = idTipoGuardia;
        this.activo = activo;
        this.idAsistencial = idAsistencial;
        this.idServicio = idServicio;
        this.idEfector = idEfector;
        
        this.idUsuarioIngreso = idUsuarioIngreso;
        this.idUsuarioEgreso = idUsuarioEgreso ?? null;
    }
}