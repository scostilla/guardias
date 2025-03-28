import { Efector } from "./Efector";
export class Feriado {

    id?: number;
    descripcion: string;
    motivo: string;
    tipoFeriado: string;
    fecha: Date;
    esPatronal: boolean;
    efector?: Efector;

  
    constructor(descripcion: string, motivo: string, tipoFeriado: string, fecha: Date, esPatronal: boolean, efector: Efector) {
      this.descripcion = descripcion;
      this.motivo = motivo;
      this.tipoFeriado = tipoFeriado;
      this.fecha = fecha;
      this.esPatronal = esPatronal;
      this.efector = efector;
    }
  }
  