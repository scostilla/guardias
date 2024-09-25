import { LeyDto } from "./LeyDto";

export class IncisoDto extends LeyDto {
    idArticulo: number;
    idNovedadesPersonales: number;
  
    constructor(
      numero: string,
      denominacion: string,
      estado: string,
      fechaAlta: Date,
      idTipoLey: number,
      detalle: string,
      fechaBaja: Date,
      fechaModificacion: Date,
      motivoModificacion: string,
      activo: boolean = true,
      idArticulo: number,
      idNovedadesPersonales: number,  
    ) {
      super(numero, denominacion, estado, fechaAlta, idTipoLey, detalle, fechaBaja, fechaModificacion, motivoModificacion, activo);
      this.idArticulo = idArticulo;
      this.idNovedadesPersonales = idNovedadesPersonales;
    }
  }