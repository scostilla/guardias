import { RegistroMensual } from "../RegistroMensual";
import { Efector } from "./Efector";
import { Usuario } from "../login/Usuario";
import { ValorGmi } from "../ValorGmi";
import { ObservacionDdjj } from '../ObservacionDdjj';
import { TipoGuardia } from './TipoGuardia';
import { CronogramaDefinitivo } from '../Cronogramas/CronogramaDefinitivo';

export class Ddjj {
    id?: number;
    activo: boolean;
    mes: string;
    anio: number;
    subtotal: number;
    total: number;
    valorGmi?: ValorGmi | null;
    efector?: Efector | null;

    registrosMensuales?: RegistroMensual[];
    observacionesDdjj?: ObservacionDdjj[];

    director?: Usuario | null;
    directorDPH?: Usuario | null;
    estadoDdjjDirector?: string | null;
    estadoDdjjDirectorDPH?: string | null;
    enPosesionDirector?: boolean | null;
    enPosesionDirectorDPH?: boolean | null;
    motivoDirector?: string | null;
    motivoDirectorDPH?: string | null;

    tipoGuardia?: TipoGuardia | null;
    cronogramasDefinitivos?: CronogramaDefinitivo[];

    constructor(
        activo: boolean,
        mes: string,
        anio: number,
        subtotal: number,
        total: number,
        valorGmi?: ValorGmi | null,
        efector?: Efector | null,

        registrosMensuales?: RegistroMensual[],
        observacionesDdjj?: ObservacionDdjj[],

        director?: Usuario | null,
        directorDPH?: Usuario | null,
        estadoDdjjDirector?: string | null,
        estadoDdjjDirectorDPH?: string | null,
        enPosesionDirector?: boolean | null,
        enPosesionDirectorDPH?: boolean | null,
        motivoDirector?: string | null,
        motivoDirectorDPH?: string | null,

        tipoGuardia?: TipoGuardia | null,
        cronogramasDefinitivos?: CronogramaDefinitivo[],
    ) {
        this.activo = activo;
        this.mes = mes;
        this.anio = anio;
        this.subtotal = subtotal;
        this.total = total;
        this.valorGmi = valorGmi;
        this.efector = efector;
        this.registrosMensuales = registrosMensuales;
        this.observacionesDdjj = observacionesDdjj;
        this.director = director;
        this.directorDPH = directorDPH;
        this.estadoDdjjDirector = estadoDdjjDirector;
        this.estadoDdjjDirectorDPH = estadoDdjjDirectorDPH;
        this.enPosesionDirector = enPosesionDirector;
        this.enPosesionDirectorDPH = enPosesionDirectorDPH;
        this.motivoDirector = motivoDirector;
        this.motivoDirectorDPH = motivoDirectorDPH;
        this.tipoGuardia = tipoGuardia;
        this.cronogramasDefinitivos = cronogramasDefinitivos;
    }
}