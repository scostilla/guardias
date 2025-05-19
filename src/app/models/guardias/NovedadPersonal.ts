import { Person } from "../Configuracion/Person";
import { TipoLicencia } from "../Configuracion/TipoLicencia";


export class NovedadPersonal {
    id?: number;
    activo: boolean;
    cobraSueldo: boolean;
    fechaInicio: Date;
    fechaFinal: Date;
    //necesitaReemplazo: boolean;
    puedeRealizarGuardia: boolean;
    persona: Person;
    tipoLicencia: TipoLicencia;
    //suplente?: Person;

    constructor(
        activo: boolean,
        cobraSueldo: boolean,
        fechaInicio: Date,
        fechaFinal: Date,
        //necesitaReemplazo: boolean,
        puedeRealizarGuardia: boolean,
        persona: Person,
        tipoLicencia: TipoLicencia,
        //suplente?: Person,
    ) {

        this.activo = activo;
        this.cobraSueldo = cobraSueldo;
        this.fechaFinal = fechaFinal;
        this.fechaInicio = fechaInicio;
        //this.necesitaReemplazo = necesitaReemplazo;
        this.puedeRealizarGuardia = puedeRealizarGuardia;
        this.persona = persona;
        this.tipoLicencia = tipoLicencia;
        //this.suplente = suplente;
    }
}
