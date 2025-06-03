export class AutoridadDto {
    activo: boolean;
    confirmado: boolean | null;
    idPersona: number;
    motivo: string | null;

    constructor(
        activo: boolean,
        confirmado: boolean | null,
        idPersona: number,
        motivo: string | null,
    ) { 
        this.activo = activo;
        this.confirmado = confirmado;
        this.idPersona = idPersona;
        this.motivo = motivo;
    }
}