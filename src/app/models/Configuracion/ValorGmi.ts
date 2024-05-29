import { Ddjj } from "./Ddjj";
import { TipoGuardia } from "./TipoGuardia";

export class ValorGmi {
    id?: number;
    activo: boolean;
    fechaInicio: Date;
    fechaFin: Date;
    monto: number;
    tipoGuardia: TipoGuardia;
    ddjjs: Ddjj[];

    constructor(
        activo: boolean,
        fechaInicio: Date,
        fechaFin: Date,
        monto: number,
        tipoGuardia: TipoGuardia,
        ddjjs: Ddjj[]
    ) {
        this.activo = activo;
        this.fechaInicio = fechaInicio;
        this.fechaFin = fechaFin;
        this.monto = monto;
        this.tipoGuardia = tipoGuardia;
        this.ddjjs = ddjjs;
    }
}