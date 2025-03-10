
import { Legajo } from './Legajo';

export class Suspension {
    id?: number;
    descripcion: string;
    fechaInicio: Date;
    fechaFin: Date;
    activo: boolean;
    legajos: Legajo[];

    constructor(
        descripcion: string,
        fechaInicio: Date,
        fechaFin: Date,
        activo: boolean,
        legajos: Legajo[],
    ){
        this.descripcion = descripcion;
        this.fechaInicio = fechaInicio;
        this.fechaFin = fechaFin;
        this.activo = activo;
        this.legajos = legajos;
    }
}
