import { RegistroMensual } from "./RegistroMensual";
import { RegistroActividad } from "./RegistroActividad";

export class SumaHoras {
    id: number;
    horasLav: number;
    horasSdf: number;
    montoLav: number;       // BigDecimal → number
    montoSdf: number;
    montoTotal: number;
    registroMensual?: RegistroMensual;
    registroActividad?: RegistroActividad;
    activo: boolean;

    constructor(
        id: number,
        horasLav: number,
        horasSdf: number,
        montoLav: number,       // BigDecimal → number
        montoSdf: number,
        montoTotal: number,
        activo: boolean,
        registroMensual?: RegistroMensual,
        registroActividad?: RegistroActividad,
    ) { 
        this.id = id;
        this.horasLav = horasLav;
        this.horasSdf = horasSdf;
        this.montoLav = montoLav;
        this.montoSdf = montoSdf;
        this.montoTotal = montoTotal;
        this.registroMensual = registroMensual;
        this.registroActividad = registroActividad;
        this.activo = activo;
    }
}