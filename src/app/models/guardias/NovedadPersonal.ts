import { Person } from "../Configuracion/Person";
import { Articulo } from "./Articulo";
import { Inciso } from "./Inciso";


export class NovedadPersonal {
    id?: number;
    actual: boolean;
    cobraSueldo: boolean;
    descripcion: string;
    fechaFinal: Date;
    fechaInicio: Date;
    necesitaReemplazo: boolean;
    puedeRealizarGuardia: boolean;
    articulo: Articulo;
    inciso: Inciso;
    persona: Person;
    suplente: Person;

    constructor(
        actual: boolean,
        cobraSueldo: boolean,
        descripcion: string,
        fechaFinal: Date,
        fechaInicio: Date,
        necesitaReemplazo: boolean,
        puedeRealizarGuardia: boolean,
        articulo: Articulo,
        inciso: Inciso,
        persona: Person,
        suplente: Person,
    ) {

        this.actual = actual;
        this.cobraSueldo = cobraSueldo;
        this.descripcion = descripcion;
        this.fechaFinal = fechaFinal;
        this.fechaInicio = fechaInicio;
        this.necesitaReemplazo = necesitaReemplazo;
        this.puedeRealizarGuardia = puedeRealizarGuardia;
        this.articulo = articulo;
        this.inciso = inciso;
        this.persona = persona;
        this.suplente = suplente;
    }
}
