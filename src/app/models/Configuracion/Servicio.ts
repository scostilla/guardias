import { RegistroActividad } from "../RegistroActividad";
import { Efector } from "../Configuracion/Efector";
import { DistribucionGuardia } from "../personal/DistribucionGuardia";
import { DistribucionConsultorio } from "../personal/DistribucionConsultorio";

export class Servicio {
    id?: number;
    descripcion: string;
    nivel: number;
    critico: boolean;
    registrosActividades: RegistroActividad[];
    efectores: Efector[];
    distribucionesGuardias: DistribucionGuardia[];
    distribucionesConsultorios: DistribucionConsultorio[]

    constructor(descripcion: string, nivel: number, critico: boolean, registrosActividades: RegistroActividad[], efectores: Efector[],
        distribucionesGuardias: DistribucionGuardia[], distribucionesConsultorios: DistribucionConsultorio[]) {
        this.descripcion = descripcion;
        this.nivel = nivel;
        this.critico = critico;
        this.registrosActividades = registrosActividades;
        this.efectores = efectores;
        this.distribucionesGuardias = distribucionesGuardias;
        this.distribucionesConsultorios = distribucionesConsultorios
    }
}