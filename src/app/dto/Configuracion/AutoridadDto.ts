export class AutoridadDto {
    nombre: string;
    fechaInicio: Date;
    fechaFinal: Date | null;
    esRegional: boolean;
    activo: boolean;
    idEfector: number;
    idPersona: number;
    idCargo: number | null;

    constructor(
        nombre: string,
        fechaInicio: Date,
        fechaFinal: Date | null,
        esRegional: boolean,
        activo: boolean,
        idEfector: number,
        idPersona: number,
        idCargo: number | null
    ) { 
        this.nombre=nombre;
        this.fechaInicio = fechaInicio;
        this.fechaFinal = fechaFinal;
        this.esRegional = esRegional;
        this.activo = activo;
        this.idEfector = idEfector;
        this.idPersona = idPersona;
        this.idCargo = idCargo;
    }
}