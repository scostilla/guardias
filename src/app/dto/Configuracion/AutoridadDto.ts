export class AutoridadDto {
    activo: boolean;
    idPersona: number;

    constructor(
        activo: boolean,
        idPersona: number,
    ) { 
        this.activo = activo;
        this.idPersona = idPersona;
    }
}