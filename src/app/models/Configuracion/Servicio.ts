import { RegistroActividad } from "../RegistroActividad";

export class Servicio {
    id?: number;
    descripcion: string;
    nivel: number;
    activo: boolean;
    registrosActividades: RegistroActividad[];

    constructor(descripcion: string, nivel: number, activo: boolean, registrosActividades: RegistroActividad[]) {
        this.descripcion = descripcion;
        this.nivel = nivel;
        this.activo = activo;
        this.registrosActividades = registrosActividades;
    }
}