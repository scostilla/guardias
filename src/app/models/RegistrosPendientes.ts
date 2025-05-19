import { Efector } from "./Configuracion/Efector";
import { RegistroActividad } from "./RegistroActividad";

export class RegistrosPendientes {
    id?: number;
    fecha: Date;
    activo: boolean;
    efector: Efector;
    registrosActividades: RegistroActividad[];

    constructor(
        fecha: Date,
        activo: boolean,
        efector: Efector,
        registrosActividades: RegistroActividad[]
    ) { 
        this.fecha = fecha;
        this.activo = activo;
        this.efector = efector;
        this.registrosActividades = registrosActividades;
    }
}