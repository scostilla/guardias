export class NovedadPersonalDto {

        cobraSueldo: boolean;
        fechaInicio: Date;
        fechaFinal: Date;
        necesitaReemplazo: boolean;
        puedeRealizarGuardia: boolean;
        activo: boolean;
        idPersona: number;
        idTipoLicencia: number;
        idSuplente?: number;
    
        constructor(
            cobraSueldo: boolean,
            fechaInicio: Date,
            fechaFinal: Date,
            necesitaReemplazo: boolean,
            puedeRealizarGuardia: boolean,
            activo: boolean,
            idPersona: number,
            idTipoLicencia: number,
            idSuplente?: number,
            ) {
    
            this.cobraSueldo = cobraSueldo;
            this.fechaInicio = fechaInicio;
            this.necesitaReemplazo = necesitaReemplazo;
            this.puedeRealizarGuardia = puedeRealizarGuardia;
            this.activo = activo;
            this.idPersona = idPersona;
            this.idSuplente = idSuplente;
            this.fechaFinal = fechaFinal;
            this.idTipoLicencia = idTipoLicencia;
        }
    }
    
