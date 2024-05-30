import { Asistencial } from "./Configuracion/Asistencial";
import { Servicio } from "./Configuracion/Servicio";
import { Efector } from "./Configuracion/Efector";
import { TipoGuardia } from "./Configuracion/TipoGuardia";
import { RegistroMensual } from "./RegistroMensual";
import { RegistrosPendientes } from "./RegistrosPendientes";
import { Usuario } from "./login/Usuario";

export class RegistroActividad {
    id?: number;
    fechaIngreso: Date;
    fechaEgreso: Date;
    horaIngreso: Date;
    horaEgreso: Date;
    tipoGuardia: TipoGuardia;
    activo: boolean;
    asistencial: Asistencial;
    servicio: Servicio;
    efector: Efector;
    registroMensual: RegistroMensual;
    registrosPendientes: RegistrosPendientes;
    usuario: Usuario;
    fechaRegistro: Date;
    horaRegistro: Date;

    constructor(fechaIngreso: Date, fechaEgreso: Date, horaIngreso: Date, horaEgreso: Date, tipoGuardia: TipoGuardia, activo: boolean, asistencial: Asistencial, servicio: Servicio, efector: Efector, registroMensual: RegistroMensual,registrosPendientes: RegistrosPendientes, usuario: Usuario, fechaRegistro: Date, horaRegistro: Date) {

        this.fechaIngreso = fechaIngreso;
        this.fechaEgreso = fechaEgreso;
        this.horaIngreso = horaIngreso;
        this.horaEgreso = horaEgreso;
        this.tipoGuardia = tipoGuardia;
        this.activo = activo;
        this.asistencial = asistencial;
        this.servicio = servicio;
        this.efector = efector;
        this.registroMensual = registroMensual;
        this.registrosPendientes = registrosPendientes;
        this.usuario = usuario;
        this.fechaRegistro = fechaRegistro;
        this.horaRegistro = horaRegistro;
    }
}