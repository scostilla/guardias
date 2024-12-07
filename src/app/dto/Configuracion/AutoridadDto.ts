export class AutoridadDto {
    activo: boolean;
    confirmado: boolean | null;
    idPersona: number;

    constructor(
        activo: boolean,
        confirmado: boolean | null,
        idPersona: number,
    ) { 
        this.activo = activo;
        this.confirmado = confirmado;
        this.idPersona = idPersona;
    }
}