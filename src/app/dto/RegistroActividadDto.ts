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

    constructor(fechaIngreso: Date, fechaEgreso: Date, horaIngreso: Date, horaEgreso: Date, idTipoGuardia: number, activo: boolean, idAsistencial: number, idServicio: number, idEfector: number) {

        this.fechaIngreso = fechaIngreso;
        this.fechaEgreso = fechaEgreso;
        this.horaIngreso = horaIngreso;
        this.horaEgreso = horaEgreso;
        this.idTipoGuardia = idTipoGuardia;
        this.activo = activo;
        this.idAsistencial = idAsistencial;
        this.idServicio = idServicio;
        this.idEfector = idEfector;
    }
}