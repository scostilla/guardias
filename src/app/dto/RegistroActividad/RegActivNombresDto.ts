export class RegActivNombresDto {
    id: number;
    fechaIngreso: Date;
    horaIngreso: string;
    tipoGuardia: string;
    asistencial: string;
    servicio: string;
    idEfector: number;
    idUsuarioIngreso: number;

    constructor(id: number,fechaIngreso: Date, horaIngreso: string, tipoGuardia: string, asistencial: string, servicio: string, idEfector: number, idUsuarioIngreso: number) {

        this.id = id;
        this.fechaIngreso = fechaIngreso;
        this.horaIngreso = horaIngreso;
        this.tipoGuardia = tipoGuardia;
        this.asistencial = asistencial;
        this.servicio = servicio;
        this.idEfector = idEfector;
        this.idUsuarioIngreso = idUsuarioIngreso;
    }
}
