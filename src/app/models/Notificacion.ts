export class Notificacion {
    id?: number;
    tipo: string;
    categoria: string;
    fechaNotificacion: Date;
    detalle: string;
    url: string;
    activo: boolean;
    
    
  
    constructor(tipo: string,categoria: string, fechaNotificacion: Date, detalle: string, url: string, activo: boolean) {
      this.tipo = tipo;
      this.categoria = categoria;
      this.fechaNotificacion = fechaNotificacion;
      this.detalle = detalle;
      this.url = url;
      this.activo = activo;
    }
  }
  