
export class ValorBonoUti {
    id?: number;
    fechaInicio: Date;
    fechaFin: Date | null;
    monto: number;
    documentoLegal: string;

    constructor(
        fechaInicio: Date,
        fechaFin: Date | null,
        monto: number,
        documentoLegal: string,
    ) {
        this.fechaInicio = fechaInicio;
        this.fechaFin = fechaFin;
        this.monto = monto;
        this.documentoLegal = documentoLegal;
    }
}