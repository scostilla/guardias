import { Profesion } from './Profesion';
import { Person } from './Person';
import { Revista } from './Revista';

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
    revista: Revista;
    idSuspencion: number;
    idUdo: number;
    agrupacion: string;
    idCargo: number;
    

    constructor(actual: boolean, fechaFinal: Date, fechaInicio: Date,  legal: boolean, matriculaNacional: string, matriculaProvincial: string, persona: Person, profesion: Profesion, revista: Revista, idSuspencion: number, idUdo: number, agrupacion: string, idCargo: number) {
        this.actual = actual;
        this.fechaFinal = fechaFinal;
        this.fechaInicio = fechaInicio;
        this.legal = legal;
        this.matriculaNacional = matriculaNacional;
        this.matriculaProvincial = matriculaProvincial;
        this.persona = persona;
        this.profesion = profesion;
        this.revista = revista;
        this.idSuspencion = idSuspencion;
        this.idUdo = idUdo;
        this.agrupacion = agrupacion;
        this.idCargo = idCargo;
    }

  }
