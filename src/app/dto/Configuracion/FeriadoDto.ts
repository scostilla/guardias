export class FeriadoDto {

    id?: number;
    fecha: Date;
    motivo: string;
    tipoFeriado: string;
    esPatronal: boolean;
    descripcion?: string;
    idEfector?: number | null;
  
    constructor(
        fecha: Date,
        motivo: string,
        tipoFeriado: string,
        esPatronal: boolean,
        descripcion?: string,
        idEfector?: number | null,
    ) {
        this.fecha = fecha;
        this.motivo = motivo;
        this.tipoFeriado = tipoFeriado;
        this.esPatronal = esPatronal;
        this.descripcion = descripcion;
        this.idEfector = idEfector || null;
    }
}
