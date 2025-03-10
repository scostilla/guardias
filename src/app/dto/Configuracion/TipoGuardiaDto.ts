export class TipoGuardiaDto {
    nombre: string;
    descripcion: string;
    activo?: boolean; 
    idRegistrosActividades?: number[];
    idLegajos?: number[]; 

    constructor(
        nombre: string,
        descripcion: string,
        activo?: boolean,
        idRegistrosActividades?: number[],
        idLegajos?: number[],
    ){
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.activo = activo;
        this.idRegistrosActividades = idRegistrosActividades;
        this.idLegajos = idLegajos;
    }
}
