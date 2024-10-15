
export class TipoLicenciaDto {
    nombre: string;
    idTipoLey: number;
    activo: boolean;
    constructor(
        nombre: string,
        idTipoLey: number,
        activo: boolean
    ) {
        this.nombre = nombre;
        this.idTipoLey = idTipoLey;
        this.activo = activo;
    }
}