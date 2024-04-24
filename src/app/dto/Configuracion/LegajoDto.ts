export class LegajoDto {
    fechaInicio: Date;
    fechaFinal: Date;
    actual: boolean;
    legal: boolean;
    activo:boolean;
    matriculaNacional: string;
    matriculaProvincial: string;
    idProfesion: number;
    idRevista:number;
    idUdo: number;
    idPersona: number;
   // idCargo: number;
    
    constructor(fechaInicio: Date,fechaFinal: Date,actual: boolean,    legal: boolean, activo:boolean, matriculaNacional: string, matriculaProvincial: string,idProfesion:number, idRevista: number, idUdo: number, idPersona:number/* , idCargo:number */) {
        
        this.fechaInicio = fechaInicio;
        this.fechaFinal = fechaFinal;
        this.actual = actual;
        this.legal = legal;
        this.activo = activo;
        this.matriculaNacional = matriculaNacional;
        this.matriculaProvincial = matriculaProvincial;
        this.idProfesion = idProfesion;
        this.idRevista = idRevista;
        this.idUdo = idUdo;
        this.idPersona = idPersona;
        //this.idCargo = idCargo;
    }

  }