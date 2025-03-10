import { Asistencial } from 'src/app/models/Configuracion/Asistencial';
import { TipoLicencia } from 'src/app/models/Configuracion/TipoLicencia';

export class NovedadPersonal {
        id?: number;
        persona: Asistencial;
        suplente : Asistencial;
        fechaInicio: Date;
        fechaFinal: Date;
        puedeRealizarGuardia: boolean;
        cobraSueldo: boolean;
        necesitaReemplazo: boolean;
        activo: boolean;
        tipoLicencia: TipoLicencia;
    
    
    
        constructor(
            persona: Asistencial,
            suplente : Asistencial,
            fechaInicio: Date,
            fechaFinal: Date,
            puedeRealizarGuardia: boolean,
            cobraSueldo: boolean,
            necesitaReemplazo: boolean,
            activo: boolean,
            tipoLicencia: TipoLicencia,
            ){
            this.persona = persona;
            this.suplente = suplente;
            this.fechaInicio = fechaInicio;
            this.fechaFinal = fechaFinal;
            this.puedeRealizarGuardia = puedeRealizarGuardia;
            this.cobraSueldo = cobraSueldo;
            this.necesitaReemplazo = necesitaReemplazo;
            this.activo = activo;
            this.tipoLicencia = tipoLicencia;
        }
}
