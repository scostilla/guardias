export class Servicio{
id?: number;
descripcion: string;
nivel: number;
activo: boolean;

constructor(descripcion: string, nivel: number, activo: boolean){
    this.descripcion =descripcion;
    this. nivel = nivel;
    this.activo = activo;
}
}