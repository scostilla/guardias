export class AutoridadDto {
    fechaInicio: Date;
    fechaFinal: Date | null;
    esRegional: boolean;
    activo: boolean;
    idEfector: number;
    idPersona: number;
    idCargo: number | null;

    constructor(
        fechaInicio: Date,
        fechaFinal: Date | null,
        esRegional: boolean,
        activo: boolean,
        idEfector: number,
        idPersona: number,
        idCargo: number | null
    ) { 
        this.fechaInicio = fechaInicio;
        this.fechaFinal = fechaFinal;
        this.esRegional = esRegional;
        this.activo = activo;
        this.idEfector = idEfector;
        this.idPersona = idPersona;
        this.idCargo = idCargo;
    }
}