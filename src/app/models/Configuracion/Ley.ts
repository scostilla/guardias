import { TipoLey } from './TipoLey';

export class Ley {
    id?: number;
    numero: string;
    denominacion: string;
    detalle?: string; // Opcional
    estado: string;
    fechaAlta: Date;
    fechaBaja?: Date; // Opcional
    fechaModificacion?: Date; // Opcional
    motivoModificacion?: string; // Opcional
    activo: boolean;
    tipoLey: TipoLey;
  
    constructor(
      numero: string,
      denominacion: string,
      estado: string,
      fechaAlta: Date,
      tipoLey: TipoLey,
      detalle?: string,
      fechaBaja?: Date,
      fechaModificacion?: Date,
      motivoModificacion?: string,
      activo: boolean = true
    ) {
      this.numero = numero;
      this.denominacion = denominacion;
      this.estado = estado;
      this.fechaAlta = fechaAlta;
      this.tipoLey = tipoLey;
      this.detalle = detalle;
      this.fechaBaja = fechaBaja;
      this.fechaModificacion = fechaModificacion;
      this.motivoModificacion = motivoModificacion;
      this.activo = activo;
    }
  }