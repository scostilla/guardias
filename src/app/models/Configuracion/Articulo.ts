import { Ley } from "./Ley";
import { TipoLey } from './TipoLey';
import { Inciso } from './Inciso';
import { NovedadPersonal } from '../personal/NovedadPersonal';

export class Articulo extends Ley {
  idArticuloPadre?: number;
  articuloPadre?: Articulo;
  subArticulos?: Articulo[] = [];
  incisos: Inciso[] = [];
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
      incisos: Inciso[] = [],
      novedadesPersonales: NovedadPersonal[]  
    ) {
      super(numero, denominacion, estado, fechaAlta, tipoLey, detalle, fechaBaja, fechaModificacion, motivoModificacion, activo);
      this.incisos = incisos;
      this.novedadesPersonales = novedadesPersonales;
    }
  }