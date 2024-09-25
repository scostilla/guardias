import { Ley } from "./Ley";
import { TipoLey } from './TipoLey';

export class Inciso extends Ley {
    idArticulo: number;
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
      idArticulo: number,
      idNovedadesPersonales: number,  
    ) {
      super(numero, denominacion, estado, fechaAlta, tipoLey, detalle, fechaBaja, fechaModificacion, motivoModificacion, activo);
      this.idArticulo = idArticulo;
      this.idNovedadesPersonales = idNovedadesPersonales;
    }
  }