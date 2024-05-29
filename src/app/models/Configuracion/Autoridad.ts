import { Efector } from "./Efector";
import { Person } from "./Person";

export class Autoridad {
    id?: number;
    nombre: string;
    fechaInicio: Date;
    fechaFinal: Date;
    esActual: boolean;
    esRegional: boolean;
    activo: boolean;
    efector: Efector;
    persona: Person;

    constructor(
        nombre: string,
        fechaInicio: Date,
        fechaFinal: Date,
        esActual: boolean,
        esRegional: boolean,
        activo: boolean,
        efector: Efector,
        persona: Person
    ) {
        this.nombre = nombre;
        this.fechaInicio = fechaInicio
        this.fechaFinal = fechaFinal;
        this.esActual = esActual;
        this.esRegional = esRegional;
        this.activo = activo;
        this.efector = efector;
        this.persona = persona;
    }
}