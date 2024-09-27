import { Ley } from "./Ley";
import { TipoLey } from './TipoLey';
import { Articulo } from './Articulo';
import { NovedadPersonal } from '../personal/NovedadPersonal';

export class Inciso extends Ley {
  incisoPadre: Inciso;
  subIncisos: Inciso[] = [];
  articulo: Articulo;
  novedadesPersonales: NovedadPersonal[] = [];
  
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
      incisoPadre: Inciso,
      subIncisos: Inciso[] = [],
      articulo: Articulo,
      novedadesPersonales: NovedadPersonal[]
        ) {
      super(numero, denominacion, estado, fechaAlta, tipoLey, detalle, fechaBaja, fechaModificacion, motivoModificacion, activo);
      this.incisoPadre = incisoPadre;
      this.subIncisos = subIncisos;
      this.articulo = articulo;
      this.novedadesPersonales = novedadesPersonales;
    }
  }