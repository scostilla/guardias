import { Efector } from '../Configuracion/Efector';
import { Ddjj } from '../Configuracion/Ddjj';

export class CronogramaDefinitivo {
  id?: number;
  mes: string;
  anio: number;
  activo: boolean;
  efector: Efector;
  ddjjs: Ddjj[];
    
    constructor(
        mes: string,
        anio: number,
        activo: boolean,
        efector: Efector,
        ddjjs: Ddjj[],
        ) {
        this.mes = mes;
        this.anio = anio;
        this.activo = activo;
        this.efector = efector;
        this.ddjjs = ddjjs;
        }
}
