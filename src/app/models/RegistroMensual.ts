import { Person } from "./Configuracion/Person";
import { Efector } from "./Configuracion/Efector";
import { RegistroActividad } from "./RegistroActividad";
import { SumaHoras } from './suma-horas';
import { Ddjj } from './Configuracion/Ddjj';


export class RegistroMensual {
    id?: number;
    mes: string;
    anio: number;
    asistencial: Person;
    activo: boolean;
    registroActividad: RegistroActividad[];
    efector: Efector;
    ddjj?: Ddjj;
    totalHoras?: SumaHoras;

    constructor (
        mes: string, 
        anio: number, 
        asistencial: Person, 
        activo: boolean, 
        registroActividad: RegistroActividad[], 
        efector: Efector,
        ddjj?: Ddjj,
        totalHoras?: SumaHoras,
    ){
        this.mes = mes;
        this.anio= anio;
        this.asistencial = asistencial;
        this.activo = activo;
        this.registroActividad = registroActividad;
        this.efector = efector;
        this.ddjj = ddjj;
        this.totalHoras = totalHoras;
    }
}