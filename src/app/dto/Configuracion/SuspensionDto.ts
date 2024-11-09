export class SuspensionDto {
    descripcion: string;
    fechaInicio: Date;
    activo: boolean;
    fechaFin: Date;
    idLegajos: number[];

    constructor(
        descripcion: string,
        fechaInicio: Date,
        activo: boolean,
        fechaFin: Date,
        idLegajos: number[],
    ){
        this.descripcion = descripcion;
        this.fechaInicio = fechaInicio;
        this.activo = activo;
        this.fechaFin = fechaFin;
        this.idLegajos = idLegajos;
    }
}
