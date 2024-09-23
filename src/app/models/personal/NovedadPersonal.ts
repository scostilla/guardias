export class NovedadPersonal {
    idPersona: number;
    idSuplente : number;
    idArticulo: number;
    idInciso: number;
    fechaInicio: Date;
    fechaFinal: Date;
    puedeRealizarGuardia: boolean;
    cobraSueldo: boolean;
    necesitaReemplazo: boolean;
    actual: boolean;
    descripcion: string;



    constructor(
        idPersona: number,
        idSuplente : number,
        idArticulo: number,
        idInciso: number,
        fechaInicio: Date,
        fechaFinal: Date,
        puedeRealizarGuardia: boolean,
        cobraSueldo: boolean,
        necesitaReemplazo: boolean,
        actual: boolean,
        descripcion: string,
        ){
        this.idPersona = idPersona;
        this.idSuplente = idSuplente;
        this.idArticulo = idArticulo;
        this.idInciso = idInciso;
        this.fechaInicio = fechaInicio;
        this.fechaFinal = fechaFinal;
        this.puedeRealizarGuardia = puedeRealizarGuardia;
        this.cobraSueldo = cobraSueldo;
        this.necesitaReemplazo = necesitaReemplazo;
        this.actual = actual;
        this.descripcion = descripcion;
    }

}
