export class NovedadPersonalDto {

        activo: boolean;
        cobraSueldo: boolean;
        fechaInicio: Date;
        fechaFinal: Date;
        necesitaReemplazo: boolean;
        puedeRealizarGuardia: boolean;
        idPersona: number;
        idTipoLicencia: number;
        idSuplente?: number;
    
        constructor(
            activo: boolean,
            cobraSueldo: boolean,
            fechaInicio: Date,
            fechaFinal: Date,
            necesitaReemplazo: boolean,
            puedeRealizarGuardia: boolean,
            idPersona: number,
            idTipoLicencia: number,
            idSuplente?: number,
            ) {
    
            this.activo = activo;
            this.cobraSueldo = cobraSueldo;
            this.fechaInicio = fechaInicio;
            this.fechaFinal = fechaFinal;
            this.necesitaReemplazo = necesitaReemplazo;
            this.puedeRealizarGuardia = puedeRealizarGuardia;
            this.idPersona = idPersona;
            this.idTipoLicencia = idTipoLicencia;
            this.idSuplente = idSuplente;
        }
    }
    
