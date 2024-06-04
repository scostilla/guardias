export class AutoridadDto {
    nombre: string;
    fechaInicio: Date;
    fechaFinal: Date;
    esActual: boolean;
    esRegional: boolean
    idEfector: number;
    idPersona: number;

    constructor(
        nombre: string,
        fechaInicio: Date,
        fechaFinal: Date,
        esActual: boolean,
        esRegional: boolean,
        idEfector: number,
        idPersona: number
    ) { 
        this.nombre=nombre;
        this.fechaInicio = fechaInicio;
        this.fechaFinal = fechaFinal;
        this.esActual = esActual;
        this.esRegional = esRegional;
        this.idEfector = idEfector;
        this.idPersona = idPersona;
    }
}