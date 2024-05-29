import { Efector } from "./Efector";
import { Person } from "./Person";

export class DistribucionHoraria {
    id?: number;
    dia: string;
    fechaInicio: Date;
    fechaFinalizacion: Date;
    horaIngreso: Date;
    cantidadHoras: number;
    activo: boolean;
    efector: Efector;
    persona: Person;

    constructor(
        dia: string,
        fechaInicio: Date,
        fechaFinalizacion: Date,
        horaIngreso: Date,
        cantidadHoras: number,
        activo: boolean,
        efector: Efector,
        persona: Person,
    ) {
        this.dia = dia;
        this.fechaInicio = fechaInicio;
        this.fechaFinalizacion = fechaFinalizacion;
        this.horaIngreso = horaIngreso;
        this.cantidadHoras = cantidadHoras;
        this.activo = activo;
        this.efector = efector;
        this.persona = persona;
    }
}