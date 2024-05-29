import { RegistroActividad } from "../RegistroActividad";
import { RegistroMensual } from "../RegistroMensual";
import { RegistrosPendientes } from "../RegistrosPendientes";
import { Autoridad } from "./Autoridad";
import { Ddjj } from "./Ddjj";
import { DistribucionHoraria } from "./DistribucionHoraria";
import { Efector } from "./Efector";
import { Legajo } from "./Legajo";
import { Localidad } from "./Localidad";
import { Region } from "./Region";
import { Servicio } from "./Servicio";


export class Ministerio extends Efector {
    idCabecera: number;
    idAutoridad: number;

    constructor(
        nombre:string,
        domicilio: string,
        telefono: string, 
        estado: boolean, 
        activo: boolean, 
        observacion: string, 
        region: Region,
        localidad: Localidad,  
        idCabecera: number, 
        idAutoridad: number,
        distribucionesHorarias: DistribucionHoraria[],
        legajosUdo: Legajo[],
        legajos: Legajo[],
        servicios: Servicio[],
        notificaciones: Notification[],
        autoridades: Autoridad[],
        registrosActividades: RegistroActividad[],
        registroMensual: RegistroMensual[],
        ddjjs: Ddjj[],
        registrosPendientes: RegistrosPendientes[]
    ) 
        {
        super(nombre,domicilio,telefono,estado,activo,observacion,region,localidad, distribucionesHorarias,legajosUdo,legajos, servicios, notificaciones,autoridades,registrosActividades,registroMensual,ddjjs,registrosPendientes);
        this.idCabecera = idCabecera;
        this.idAutoridad = idAutoridad;
    }
}