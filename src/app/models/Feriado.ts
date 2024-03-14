export class Feriado {

    id?: number;
    descripcion: string;
    motivo: string;
    tipoFeriado: string;
    fecha: Date;

  
    constructor(descripcion: string, motivo: string, tipoFeriado: string, fecha: Date) {
      this.descripcion = descripcion;
      this.motivo = motivo;
      this.tipoFeriado = tipoFeriado;
      this.fecha = fecha;

    }
  }
  