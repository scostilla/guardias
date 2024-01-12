export class Feriado {

    id?: number;
    descripcion: string;
    dia: number;
    motivo: string;
    tipo_feriado: string;
    fecha: string;

  
    constructor(descripcion: string, dia: number, motivo: string, tipo_feriado: string, fecha: string) {
      this.descripcion = descripcion;
      this.dia = dia;
      this.motivo = motivo;
      this.tipo_feriado = tipo_feriado;
      this.fecha = fecha;

    }
  }
  