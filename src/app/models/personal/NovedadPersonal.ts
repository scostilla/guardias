import { Asistencial } from 'src/app/models/Configuracion/Asistencial';
import { Articulo } from 'src/app/models/Configuracion/Articulo';
import { Inciso } from 'src/app/models/Configuracion/Inciso';

export class NovedadPersonal {
        id?: number;
        persona: Asistencial;
        suplente : Asistencial;
        articulo: Articulo;
        inciso: Inciso;
        fechaInicio: Date;
        fechaFinal: Date;
        puedeRealizarGuardia: boolean;
        cobraSueldo: boolean;
        necesitaReemplazo: boolean;
        actual: boolean;
        descripcion: string;
    
    
    
        constructor(
            persona: Asistencial,
            suplente : Asistencial,
            articulo: Articulo,
            inciso: Inciso,
            fechaInicio: Date,
            fechaFinal: Date,
            puedeRealizarGuardia: boolean,
            cobraSueldo: boolean,
            necesitaReemplazo: boolean,
            actual: boolean,
            descripcion: string,
            ){
            this.persona = persona;
            this.suplente = suplente;
            this.articulo = articulo;
            this.inciso = inciso;
            this.fechaInicio = fechaInicio;
            this.fechaFinal = fechaFinal;
            this.puedeRealizarGuardia = puedeRealizarGuardia;
            this.cobraSueldo = cobraSueldo;
            this.necesitaReemplazo = necesitaReemplazo;
            this.actual = actual;
            this.descripcion = descripcion;
        }
}
