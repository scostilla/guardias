export class ServicioDto {
    id?: number;
    descripcion: string;
    nivel: number;
    critico: boolean;
    idRegistrosActividades: number[];
    idEfectores: number[];

    constructor(descripcion: string, nivel: number, critico: boolean, idRegistrosActividades: number[], idEfectores: number[]) {
        this.descripcion = descripcion;
        this.nivel = nivel;
        this.critico = critico;
        this.idRegistrosActividades = idRegistrosActividades;
        this.idEfectores = idEfectores;
    }
}