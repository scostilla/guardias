export class RegActivRegIngresoDto{
    idAsistencial: number;
    idEfector: number;
    idTipoGuardia: number;
    idServicio: number;
    fechaIngreso: Date;
    horaIngreso: Date;


    constructor(idAsistencial: number, idEfector: number, idTipoGuardia: number, idServicio: number,fechaIngreso: Date, horaIngreso: Date) {

        this.idAsistencial = idAsistencial;
        this.idEfector = idEfector;
        this.idTipoGuardia = idTipoGuardia;
        this.idServicio = idServicio;
        this.fechaIngreso = fechaIngreso;
        this.horaIngreso = horaIngreso;
       
    }
}