export class ServicioDto {
    descripcion: string;
    nivel: number;
    critico: boolean;
    activo: boolean;
    idRegistrosActividades:number[];

    constructor(descripcion: string, nivel: number, critico: boolean, activo: boolean,idRegistrosActividades:number[]) {
        this.descripcion = descripcion;
        this.nivel = nivel;
        this.critico = critico;
        this.activo = activo;
        this.idRegistrosActividades = idRegistrosActividades;
    }
}