export class FeriadoDto {

    fecha: Date;
    motivo: string;
    tipoFeriado: string;
    descripcion?: string;
    esPatronal: boolean;
    idEfector?: number;
  
    constructor(
        fecha: Date,
        motivo: string,
        tipoFeriado: string,
        descripcion: string,
        esPatronal: boolean,
        idEfector: number,
    ) {
        this.fecha = fecha;
        this.motivo = motivo;
        this.tipoFeriado = tipoFeriado;
        this.descripcion = descripcion;
        this.esPatronal = esPatronal;
        this.idEfector = idEfector;
    }
}
