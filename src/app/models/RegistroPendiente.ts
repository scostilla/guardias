import { RegistroActividad } from "./RegistroActividad";
import { Efector } from "./Configuracion/Efector";


export class RegistroPendiente {
    
    id: number;
    fecha: string;
    efector: Efector;
    registrosActividades: RegistroActividad[];

        constructor (
            id: number,
            fecha: string,
            efector: Efector,
            registrosActividades: RegistroActividad[],
                ){
            this.id = id;
            this.fecha = fecha;
            this.efector = efector;
            this.registrosActividades = registrosActividades;
        }
    }
