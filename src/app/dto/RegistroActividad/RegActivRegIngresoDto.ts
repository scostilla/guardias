export class RegActivRegIngresoDto{
    idAsistencial: number;
    idEfector: number;
    idTipoGuardia: number;
    idServicio: number;
    fechaIngreso: string;
    horaIngreso: string;


    constructor(idAsistencial: number, idEfector: number, idTipoGuardia: number, idServicio: number,fechaIngreso: string, horaIngreso: string) {

        this.idAsistencial = idAsistencial;
        this.idEfector = idEfector;
        this.idTipoGuardia = idTipoGuardia;
        this.idServicio = idServicio;
        this.fechaIngreso = fechaIngreso;
        this.horaIngreso = horaIngreso;
       
    }
}