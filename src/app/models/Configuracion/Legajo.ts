import { Profesion } from './Profesion';
import { Person } from './Person';
import { Efector } from './Efector';
import { Cargo } from './Cargo';

export class Legajo {
    id?: number;
    actual: boolean;
    fechaFinal: Date;
    fechaInicio: Date;
    legal: boolean;
    matriculaNacional: string;
    matriculaProvincial: string;
    persona: Person;
    profesion: Profesion;
    udo: Efector;
    agrupacion: string;
    cargo: Cargo;
    

    constructor(actual: boolean, fechaFinal: Date, fechaInicio: Date,  legal: boolean, matriculaNacional: string, matriculaProvincial: string, persona: Person, profesion: Profesion, udo: Efector, agrupacion: string, cargo: Cargo) {
        this.actual = actual;
        this.fechaFinal = fechaFinal;
        this.fechaInicio = fechaInicio;
        this.legal = legal;
        this.matriculaNacional = matriculaNacional;
        this.matriculaProvincial = matriculaProvincial;
        this.persona = persona;
        this.profesion = profesion;
        this.udo = udo;
        this.agrupacion = agrupacion;
        this.cargo = cargo;
    }

  }