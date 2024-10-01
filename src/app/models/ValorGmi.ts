
export class ValorGmi {
    id?: number;
    fechaInicio: Date;
    fechaFin: Date | null;
    monto: number;
    tipoGuardia: string;
    documentoLegal: string;
    /*ddjjs: Ddjj[];*/

    constructor(
        fechaInicio: Date,
        fechaFin: Date | null,
        monto: number,
        tipoGuardia: string,
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