export class NovedadPersonalDto {

        id?: number;
        actual: boolean;
        cobraSueldo: boolean;
        descripcion: string;
        fechaFinal: Date;
        fechaInicio: Date;
        necesitaReemplazo: boolean;
        puedeRealizarGuardia: boolean;
        idArticulo: number;
        idInciso: number;
        idPersona: number;
        idSuplente: number;
    
        constructor(
            actual: boolean,
            cobraSueldo: boolean,
            descripcion: string,
            fechaFinal: Date,
            fechaInicio: Date,
            necesitaReemplazo: boolean,
            puedeRealizarGuardia: boolean,
            idArticulo: number,
            idInciso: number,
            idPersona: number,
            idSuplente: number,
            ) {
    
            this.actual = actual;
            this.cobraSueldo = cobraSueldo;
            this.descripcion = descripcion;
            this.fechaFinal = fechaFinal;
            this.fechaInicio = fechaInicio;
            this.necesitaReemplazo = necesitaReemplazo;
            this.puedeRealizarGuardia = puedeRealizarGuardia;
            this.idArticulo = idArticulo;
            this.idInciso = idInciso;
            this.idPersona = idPersona;
            this.idSuplente = idSuplente;
        }
    }
    
