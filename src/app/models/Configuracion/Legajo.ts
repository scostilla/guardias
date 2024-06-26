import { Profesion } from './Profesion';
import { Person } from './Person';
import { Efector } from './Efector';
import { Revista } from './Revista';
import { Cargo } from './Cargo';
import { Especialidad } from './Especialidad';

export class Legajo {
    id?: number;
    fechaInicio: Date;
    fechaFinal: Date;
    actual: boolean;
    legal: boolean;
    activo:boolean;
    matriculaNacional: string;
    matriculaProvincial: string;
    revista:Revista;
    udo: Efector;
    persona: Person;
    cargo: Cargo;
    efectores: Efector[];
    especialidades: Especialidad[];
    profesion: Profesion;
    
    constructor(
        fechaInicio: Date,
        fechaFinal: Date,
        actual: boolean,
        legal: boolean, 
        activo:boolean, 
        matriculaNacional: string, 
        matriculaProvincial: string,
        profesion: Profesion, 
        revista: Revista, 
        udo: Efector, 
        persona: Person, 
        cargo: Cargo,
        efectores: Efector[],
        especialidades:Especialidad[]
    ) {
        
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
        this.efectores = efectores;
        this.especialidades = especialidades;
    }

  }