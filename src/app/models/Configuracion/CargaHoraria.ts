export class CargaHoraria{
    id?: number;
    cantidad: number;
    descripcion: string;
    activo: boolean;

    constructor(cantidad: number,descripcion:string, activo: boolean){
        this.cantidad = cantidad;
        this.descripcion = descripcion;
        this.activo = activo;
    }
}