export class Legajo {
    id?: number;
    actual: boolean;
    fechaFinal: Date;
    fechaInicio: Date;
    legal: boolean;
    matriculaNacional: string;
    matriculaProvincial: string;
    idPersona: number;
    idProfesion: number;
    idRevista: number;
    idSuspencion: number;
    idUdo: number;
    agrupacion: string;
    idCargo: number;
    

    constructor(actual: boolean, fechaFinal: Date, fechaInicio: Date,  legal: boolean, matriculaNacional: string, matriculaProvincial: string, idPersona: number, idProfesion: number, idRevista: number, idSuspencion: number, idUdo: number, agrupacion: string, idCargo: number) {
        this.actual = actual;
        this.fechaFinal = fechaFinal;
        this.fechaInicio = fechaInicio;
        this.legal = legal;
        this.matriculaNacional = matriculaNacional;
        this.matriculaProvincial = matriculaProvincial;
        this.idPersona = idPersona;
        this.idProfesion = idProfesion;
        this.idRevista = idRevista;
        this.idSuspencion = idSuspencion;
        this.idUdo = idUdo;
        this.agrupacion = agrupacion;
        this.idCargo = idCargo;
    }

  }
