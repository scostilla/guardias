import { Ddjj } from "./Configuracion/Ddjj";
import { TipoGuardia } from "./Configuracion/TipoGuardia";

export class ValorGmi {
    id?: number;
    fechaInicio: Date;
    fechaFin: Date;
    monto: number;
    tipoGuardia: number;
    documentoLegal: string;
    /*ddjjs: Ddjj[];*/

    constructor(
        fechaInicio: Date,
        fechaFin: Date,
        monto: number,
        tipoGuardia: number,
        documentoLegal: string,
        /*ddjjs: Ddjj[]*/
    ) {
        this.fechaInicio = fechaInicio;
        this.fechaFin = fechaFin;
        this.monto = monto;
        this.tipoGuardia = tipoGuardia;
        this.documentoLegal = documentoLegal;
        /*this.ddjjs = ddjjs;*/
    }
}