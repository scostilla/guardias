import { Asistencial } from "./Configuracion/Asistencial";
import { Efector } from "./Configuracion/Efector";
import { RegistroActividad } from "./RegistroActividad";

export class RegistroMensual {
    id?: number;
    mes: string;
    anio: number;
    asistencial: Asistencial;
    activo: boolean;
    registroActividad: RegistroActividad[];
    efector: Efector;

    constructor (
        mes: string, 
        anio: number, 
        asistencial: Asistencial, 
        activo: boolean, 
        registroActividad: RegistroActividad[], 
        efector: Efector
    ){
        this.mes = mes;
        this.anio= anio;
        this.asistencial = asistencial;
        this.activo = activo;
        this.registroActividad = registroActividad;
        this.efector = efector;
    }
}