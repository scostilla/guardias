import { Efector } from "./Configuracion/Efector";
import { RegistroActividad } from "./RegistroActividad";

export class RegistroMensual {
    id?: number;
    mes: string;
    anio: number;
    idAsistencial: number;
    activo: boolean;
    registroActividad: RegistroActividad[];
    efector: Efector;

    constructor (
        mes: string, 
        anio: number, 
        idAsistencial: number, 
        activo: boolean, 
        registroActividad: RegistroActividad[], 
        efector: Efector
    ){
        this.mes = mes;
        this.anio= anio;
        this.idAsistencial = idAsistencial;
        this.activo = activo;
        this.registroActividad = registroActividad;
        this.efector = efector;
    }
}