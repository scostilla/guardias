
export class Notificacion {
  id?: number;
  tipo: string;
  categoria: string;
  fechaNotificacion: Date;
  detalle: string;
  url: string;
  activo: boolean;
  idEfectores: number[];
  
  

  constructor(
    tipo: string,
    categoria: string, 
    fechaNotificacion: Date, 
    detalle: string, 
    url: string, 
    activo: boolean,
    idEfectores: number[]) 
    {
    this.tipo = tipo;
    this.categoria = categoria;
    this.fechaNotificacion = fechaNotificacion;
    this.detalle = detalle;
    this.url = url;
    this.activo = activo;
    this.idEfectores = idEfectores;
  }
}
