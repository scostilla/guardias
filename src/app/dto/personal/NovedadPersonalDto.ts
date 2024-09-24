export class NovedadPersonalDto {
    id?: number;
    fechaInicio: Date;        // Requerido
    fechaFinal: Date;       // Opcional
    puedeRealizarGuardia?: boolean; // Opcional
    cobraSueldo: boolean;   // Opcional
    necesitaReemplazo: boolean; // Opcional
    actual: boolean;         // Opcional
    descripcion: string;      // Requerido
    idPersona: number;        // Requerido
    idSuplente: number;       // Requerido
    idArticulo: number;       // Requerido
    idInciso: number;         // Requerido


    constructor(
        fechaInicio: Date,
        fechaFinal: Date,
        puedeRealizarGuardia: boolean,
        cobraSueldo: boolean,
        necesitaReemplazo: boolean,
        actual: boolean,
        descripcion: string,
        idPersona: number,
        idSuplente: number,
        idArticulo: number,
        idInciso: number,
      ){
        this.fechaInicio = fechaInicio;
        this.fechaFinal = fechaFinal;
        this.puedeRealizarGuardia = puedeRealizarGuardia;
        this.cobraSueldo = cobraSueldo;
        this.necesitaReemplazo = necesitaReemplazo;
        this.actual = actual;
        this.descripcion = descripcion;
        this.idPersona = idPersona;
        this.idSuplente = idSuplente;
        this.idArticulo = idArticulo;
        this.idInciso = idInciso;
    }
}
