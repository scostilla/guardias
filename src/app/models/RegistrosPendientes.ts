import { Efector } from "./Configuracion/Efector";

export class RegistrosPendientes {
    id?: number;
    fecha: Date;
    activo: boolean;
    efector: Efector;
    registrosActividades: RegistrationOptions[];

    constructor(
        fecha: Date,
        activo: boolean,
        efector: Efector,
        registrosActividades: RegistrationOptions[]
    ) { 
        this.fecha = fecha;
        this.activo = activo;
        this.efector = efector;
        this.registrosActividades = registrosActividades;
    }
}