import { Ddjj } from "./Configuracion/Ddjj";
import { TipoGuardia } from "./Configuracion/TipoGuardia";

export class ValorGmi {
    id?: number;
    activo: boolean;
    fechaInicio: Date;
    fechaFin: Date;
    monto: number;
    tipoGuardia: string;
    esLav:boolean;
    ddjjs: Ddjj[];

    constructor(
        activo: boolean,
        fechaInicio: Date,
        fechaFin: Date,
        monto: number,
        tipoGuardia: string,
        esLav:boolean,
        ddjjs: Ddjj[]
    ) {
        this.activo = activo;
        this.fechaInicio = fechaInicio;
        this.fechaFin = fechaFin;
        this.monto = monto;
        this.tipoGuardia = tipoGuardia;
        this.esLav = esLav;
        this.ddjjs = ddjjs;
    }
}