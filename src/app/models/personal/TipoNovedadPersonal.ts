export class TipoNovedadPersonal {
    id?: number;
    nombre: string;
    ley: string;
    articulo: string;
    inciso: string;
    fechaInicio: Date;
    fechaFin: Date;

    constructor(
        nombre: string,
        ley: string,
        articulo: string,
        inciso: string,
        fechaInicio: Date,
        fechaFin: Date,
            ){
        this.nombre = nombre;
        this.ley = ley;
        this.articulo = articulo;
        this.inciso = inciso;
        this.fechaInicio = fechaInicio;
        this.fechaFin = fechaFin;
    }
}

