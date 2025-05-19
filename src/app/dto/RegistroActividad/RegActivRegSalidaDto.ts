export class RegActivRegSalidaDto{
    id: number;
    fechaIngreso: Date;
    horaIngreso: string;
    idTipoGuardia: number;
    idAsistencial: number;
    idServicio: number;
    idEfector: number;
    idUsuarioIngreso: number;

    constructor(id: number,fechaIngreso: Date, horaIngreso: string, idTipoGuardia: number, idAsistencial: number, idServicio: number, idEfector: number, idUsuarioIngreso: number) {

        this.id = id;
        this.fechaIngreso = fechaIngreso;
        this.horaIngreso = horaIngreso;
        this.idTipoGuardia = idTipoGuardia;
        this.idAsistencial = idAsistencial;
        this.idServicio = idServicio;
        this.idEfector = idEfector;
        this.idUsuarioIngreso = idUsuarioIngreso;
    }
}