
export interface EfectorBasic {
  id: number;
  nombre: string;
  url?: string | null;
}

export class Notificacion {
  id?: number;
  tipo: string;
  categoria: string;
  fechaNotificacion: Date | string;
  detalle: string;
  url: string;
  activo: boolean;
  idEfectores: number[];
  tipoGuardia: string;
  efectores?: EfectorBasic[]; // <-- NUEVO (para mostrar nombres)

  constructor(
    tipo: string,
    categoria: string,
    fechaNotificacion: Date | string,
    detalle: string,
    url: string,
    activo: boolean,
    tipoGuardia: string,
    idEfectores: number[]
  ) {
    this.tipo = tipo;
    this.categoria = categoria;
    this.fechaNotificacion = fechaNotificacion;
    this.detalle = detalle;
    this.url = url;
    this.activo = activo;
    this.tipoGuardia = tipoGuardia;
    this.idEfectores = idEfectores;
  }
}
