import { Efector } from '../Configuracion/Efector';
import { TipoGuardia } from '../Configuracion/TipoGuardia';
import { Asistencial } from '../Configuracion/Asistencial';


export class CronogramaTentativo {

    id?: number;
    activo: boolean;
    aceptado: boolean;
    fechaIngreso: Date;
    fechaEgreso: Date;
    horaIngreso: string;
    horaEgreso: string;
    observacion: string;
    tipoGuardia: TipoGuardia | null;
    asistencial: Asistencial | null;
    efector: Efector | null;

    constructor(
        activo: boolean,
        aceptado: boolean,
        fechaIngreso: Date,
        fechaEgreso: Date,
        horaIngreso: string,
        horaEgreso: string,
        observacion: string,
        tipoGuardia: TipoGuardia | null,
        asistencial: Asistencial | null,
        efector: Efector | null,
        ) {
        this.activo = activo;
        this.aceptado = aceptado;
        this.fechaIngreso = fechaIngreso;
        this.fechaEgreso = fechaEgreso;
        this.horaIngreso = horaIngreso;
        this.horaEgreso = horaEgreso;
        this.observacion = observacion;
        this.tipoGuardia = tipoGuardia;
        this.asistencial = asistencial;
        this.efector = efector;
    }
}