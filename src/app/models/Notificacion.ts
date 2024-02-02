export class Notificacion {
    id?: number;
    categoria: string;
    detalle: string;
    fechanotificacion: Date;
    posicion: number;
    tipo: string;
    url: string;
  
    constructor(categoria: string, detalle: string, fechanotificacion: Date, posicion: number, tipo: string, url: string) {
      this.categoria = categoria;
      this.detalle = detalle;
      this.fechanotificacion = fechanotificacion;
      this.posicion = posicion;
      this.tipo = tipo;
      this.url = url;
    }
  }
  