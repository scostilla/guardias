import { Ley } from "./Ley";
import { TipoLey } from './TipoLey';

export class Articulo extends Ley {
    idIncisos: number;
    idNovedadesPersonales: number;
  
    constructor(
      numero: string,
      denominacion: string,
      estado: string,
      fechaAlta: Date,
      tipoLey: TipoLey,
      detalle: string,
      fechaBaja: Date,
      fechaModificacion: Date,
      motivoModificacion: string,
      activo: boolean = true,
      idIncisos: number,
      idNovedadesPersonales: number,  
    ) {
      super(numero, denominacion, estado, fechaAlta, tipoLey, detalle, fechaBaja, fechaModificacion, motivoModificacion, activo);
      this.idIncisos = idIncisos;
      this.idNovedadesPersonales = idNovedadesPersonales;
    }
  }