export class TipoRevista{
    id?: number;
    nombre: string;
    activo: boolean;

    constructor(nombre:string, activo: boolean){
        this.nombre = nombre;
        this.activo = activo;
    }
}