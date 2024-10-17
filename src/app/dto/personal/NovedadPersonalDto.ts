export class NovedadPersonalDto {
    id?: number;
    fechaInicio: Date;        // Requerido
    fechaFinal: Date;       // Opcional
    puedeRealizarGuardia?: boolean; // Opcional
    cobraSueldo: boolean;   // Opcional
    necesitaReemplazo: boolean; // Opcional
    activo: boolean;         // Opcional
    idPersona: number;        // Requerido
    idSuplente: number;       // opcional
    idTipoLicencia: number;       // Requerido


    constructor(
        fechaInicio: Date,
        fechaFinal: Date,
        puedeRealizarGuardia: boolean,
        cobraSueldo: boolean,
        necesitaReemplazo: boolean,
        activo: boolean,
        idPersona: number,
        idSuplente: number,
        idTipoLicencia: number,
      ){
        this.fechaInicio = fechaInicio;
        this.fechaFinal = fechaFinal;
        this.puedeRealizarGuardia = puedeRealizarGuardia;
        this.cobraSueldo = cobraSueldo;
        this.necesitaReemplazo = necesitaReemplazo;
        this.activo = activo;
        this.idPersona = idPersona;
        this.idSuplente = idSuplente;
        this.idTipoLicencia = idTipoLicencia;
    }
}
