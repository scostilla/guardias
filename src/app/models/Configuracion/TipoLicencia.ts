import { TipoLey } from './TipoLey';

export class TipoLicencia {
    id?: number;
    nombre: string;
    tipoLey: TipoLey;
    constructor(
        nombre: string,
        tipoLey: TipoLey
    ) {
        this.nombre = nombre;
        this.tipoLey = tipoLey;
    }
}