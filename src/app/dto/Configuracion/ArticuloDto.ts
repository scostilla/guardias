import { LeyDto } from "./LeyDto";

export class ArticuloDto extends LeyDto {
    idArticuloPadre: number; 
    idIncisos: number[];
    idNovedadesPersonales: number[];
  
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
      idArticuloPadre: number,
      idIncisos: number[],
      idNovedadesPersonales: number[],  
    ) {
      super(numero, denominacion, estado, fechaAlta, idTipoLey, detalle, fechaBaja, fechaModificacion, motivoModificacion, activo);
      this.idArticuloPadre = idArticuloPadre;
      this.idIncisos = idIncisos;
      this.idNovedadesPersonales = idNovedadesPersonales;
    }
  }