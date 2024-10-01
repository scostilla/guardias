export class LeyDto {
    numero: string;
    denominacion: string;
    detalle?: string; // Opcional
    estado: string;
    fechaAlta: Date;
    fechaBaja?: Date; // Opcional
    fechaModificacion?: Date; // Opcional
    motivoModificacion?: string; // Opcional
    activo: boolean;
    idTipoLey: number;
  
    constructor(
      numero: string,
      denominacion: string,
      estado: string,
      fechaAlta: Date,
      idTipoLey: number,
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
      this.idTipoLey = idTipoLey;
      this.detalle = detalle;
      this.fechaBaja = fechaBaja;
      this.fechaModificacion = fechaModificacion;
      this.motivoModificacion = motivoModificacion;
      this.activo = activo;
    }
  }