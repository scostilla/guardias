export class RegistroActividadDto{
    fechaIngreso: Date;
    fechaEgreso: Date;
    horaIngreso: Date;
    horaEngreso: Date;
    idTipoGuardia: number;
    activo: boolean;
    idAsistencial: number;
    idServicio: number;
    idEfector: number;

    constructor(fechaIngreso: Date, fechaEgreso: Date, horaIngreso: Date, horaEngreso: Date, idTipoGuardia: number, activo: boolean, idAsistencial: number, idServicio: number, idEfector: number) {

        this.fechaIngreso = fechaIngreso;
        this.fechaEgreso = fechaEgreso;
        this.horaIngreso = horaIngreso;
        this.horaEngreso = horaEngreso;
        this.idTipoGuardia = idTipoGuardia;
        this.activo = activo;
        this.idAsistencial = idAsistencial;
        this.idServicio = idServicio;
        this.idEfector = idEfector;
    }
}