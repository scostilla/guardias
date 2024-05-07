export class ServicioDto {
    descripcion: string;
    nivel: number;
    activo: boolean;
    idRegistrosActividades:number[];

    constructor(descripcion: string, nivel: number, activo: boolean,idRegistrosActividades:number[]) {
        this.descripcion = descripcion;
        this.nivel = nivel;
        this.activo = activo;
        this.idRegistrosActividades = idRegistrosActividades;
    }
}