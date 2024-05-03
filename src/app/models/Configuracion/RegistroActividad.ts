import { Time } from "@angular/common";
import { Asistencial } from "./Asistencial";
import { Servicio } from "./Servicio";
import { Efector } from "./Efector";
import { TipoGuardia } from "./TipoGuardia";

export class RegistroActividad {
    id?: number;
    fechaIngreso: Date;
    fechaEgreso: Date;
    horaIngreso: Date;
    horaEngreso: Date;
    tipoGuardia: TipoGuardia;
    activo: boolean;
    asistencial: Asistencial;
    servicio: Servicio;
    efector: Efector;

    constructor(fechaIngreso: Date, fechaEgreso: Date, horaIngreso: Date, horaEngreso: Date, tipoGuardia: TipoGuardia, activo: boolean, asistencial: Asistencial, servicio: Servicio, efector: Efector) {

        this.fechaIngreso = fechaIngreso;
        this.fechaEgreso = fechaEgreso;
        this.horaIngreso = horaIngreso;
        this.horaEngreso = horaEngreso;
        this.tipoGuardia = tipoGuardia;
        this.activo = activo;
        this.asistencial = asistencial;
        this.servicio = servicio;
        this.efector = efector;
    }
}
