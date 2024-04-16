export class Categoria{
    id?: number;
    nombre: string;
    activo: boolean;

    constructor(nombre:string, activo: boolean){
        this.nombre = nombre;
        this.activo = activo;
    }
}