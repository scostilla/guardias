import { Efector } from '../Configuracion/Efector';
import { Servicio } from '../Configuracion/Servicio';
import { TipoGuardia } from '../Configuracion/TipoGuardia';
import { Asistencial } from '../Configuracion/Asistencial';
import { Autoridad } from '../Configuracion/Autoridad';


export class CronogramaTentativo {

    id?: number;
    activo: boolean;
    aceptado: boolean;
    autorizado: string;
    fechaIngreso: Date;
    fechaEgreso: Date;
    horaIngreso: string;
    horaEgreso: string;
    observacion: string;
    tipoGuardia: TipoGuardia | null;
    asistencial: Asistencial | null;
    efector: Efector | null;
    servicio: Servicio;
    autoridad?: Autoridad;
    motivoAutorizacion?: string;
    motivoPediente?: string;

    constructor(
        activo: boolean,
        aceptado: boolean,
        autorizado: string,
        fechaIngreso: Date,
        fechaEgreso: Date,
        horaIngreso: string,
        horaEgreso: string,
        observacion: string,
        tipoGuardia: TipoGuardia | null,
        asistencial: Asistencial | null,
        efector: Efector | null,
        servicio: Servicio,
        autoridad?: Autoridad,
        motivoAutorizacion?: string,
        motivoPediente?: string,

        ) {
        this.activo = activo;
        this.aceptado = aceptado;
        this.autorizado = autorizado;
        this.fechaIngreso = fechaIngreso;
        this.fechaEgreso = fechaEgreso;
        this.horaIngreso = horaIngreso;
        this.horaEgreso = horaEgreso;
        this.observacion = observacion;
        this.tipoGuardia = tipoGuardia;
        this.asistencial = asistencial;
        this.efector = efector;
        this.servicio = servicio;
        this.autoridad = autoridad;
        this.motivoAutorizacion = motivoAutorizacion;
        this.motivoPediente = motivoPediente;
    }
}