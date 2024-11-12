import { Efector } from "./Efector";
import { Person } from "./Person";
import { Cargo } from "./Cargo";

export class Autoridad {
    id?: number;
    nombre: string;
    fechaInicio: Date;
    fechaFinal: Date | null;
    esRegional: boolean;
    activo: boolean;
    efector: Efector | null;
    persona: Person | null;
    cargo: Cargo | null;

    constructor(
        nombre: string,
        fechaInicio: Date,
        fechaFinal: Date | null,
        esRegional: boolean,
        activo: boolean,
        efector: Efector | null,
        persona: Person | null,
        cargo: Cargo | null,
    ) {
        this.nombre = nombre;
        this.fechaInicio = fechaInicio
        this.fechaFinal = fechaFinal;
        this.esRegional = esRegional;
        this.activo = activo;
        this.efector = efector;
        this.persona = persona;
        this.cargo = cargo;
    }
}