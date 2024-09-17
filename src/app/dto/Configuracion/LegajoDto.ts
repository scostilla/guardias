export class LegajoDto {
    fechaInicio: Date | null;
    fechaFinal: Date | null;
    actual: boolean;
    legal: boolean;
    activo:boolean;
    matriculaNacional: string;
    matriculaProvincial: string;
    idRevista:number;
    idUdo: number;
    idPersona: number;
    idCargo: number;
    idEfectores: number[];
    idEspecialidades: number[];
    idProfesion: number;
    
    constructor(
        fechaInicio: Date | null,
        fechaFinal: Date | null,
        actual: boolean, 
        legal: boolean, 
        activo:boolean, 
        matriculaNacional: string, 
        matriculaProvincial: string,
        idRevista:number,
        idUdo: number,
        idPersona: number,
        idCargo: number,
        idEfectores: number[],
        idEspecialidades: number[],
        idProfesion: number
    ) {
        
        this.fechaInicio = fechaInicio;
        this.fechaFinal = fechaFinal;
        this.actual = actual;
        this.legal = legal;
        this.activo = activo;
        this.matriculaNacional = matriculaNacional;
        this.matriculaProvincial = matriculaProvincial;
        this.idRevista = idRevista;
        this.idUdo = idUdo;
        this.idPersona = idPersona;
        this.idCargo = idCargo;
        this.idEfectores=idEfectores;
        this.idEspecialidades=idEspecialidades;
        this.idProfesion = idProfesion;
    }

  }