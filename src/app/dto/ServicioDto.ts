export class ServicioDto {
    descripcion: string;
    nivel: number;
    critico: boolean;
    activo: boolean;
    idRegistrosActividades:number[];

    // +++ backend: List<Long> idEfectores
    idEfectores: number[];

    constructor(descripcion: string, nivel: number, critico: boolean, activo: boolean, idRegistrosActividades:number[], idEfectores: number[] = []) {
        this.descripcion = descripcion;
        this.nivel = nivel;
        this.critico = critico;
        this.activo = activo;
        this.idRegistrosActividades = idRegistrosActividades;

        this.idEfectores = idEfectores;
    }
}