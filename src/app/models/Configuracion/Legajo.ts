import { Profesion } from './Profesion';
import { Person } from './Person';
import { Efector } from './Efector';

import { Revista } from './Revista';
import { Cargo } from './Cargo';

export class Legajo {
    id?: number;
    fechaInicio: Date;
    fechaFinal: Date;
    actual: boolean;
    legal: boolean;
    activo:boolean;
    matriculaNacional: string;
    matriculaProvincial: string;
    profesion: Profesion;
    revista:Revista;
    udo: Efector;
    persona: Person;
    cargo: Cargo;
    
    constructor(fechaInicio: Date,fechaFinal: Date,actual: boolean,    legal: boolean, activo:boolean, matriculaNacional: string, matriculaProvincial: string,profesion: Profesion, revista: Revista, udo: Efector, persona: Person, cargo: Cargo) {
        
        this.fechaInicio = fechaInicio;
        this.fechaFinal = fechaFinal;
        this.actual = actual;
        this.legal = legal;
        this.activo = activo;
        this.matriculaNacional = matriculaNacional;
        this.matriculaProvincial = matriculaProvincial;
        this.profesion = profesion;
        this.revista = revista;
        this.udo = udo;
        this.persona = persona;
        this.cargo = cargo;
    }

  }