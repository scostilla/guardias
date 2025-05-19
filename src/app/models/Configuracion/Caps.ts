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


export class Caps extends Efector {
  
    cabecera: Caps | null;
    areaProgramatica: number;
    tipoCaps: string;
    
    constructor(
      nombre: string,
      domicilio: string,
      telefono: string,
      estado: boolean,
      observacion: string,
      region: Region,
      localidad: Localidad,
      distribucionesHorarias: DistribucionHoraria[],
      legajosUdo: Legajo[],
      legajos: Legajo[],
      servicios: Servicio[],
      notificaciones: Notification[],
      autoridades: Autoridad[],
      registrosActividades: RegistroActividad[],
      registroMensual: RegistroMensual[],
      ddjjs: Ddjj[],
      registrosPendientes: RegistrosPendientes[],
    cabecera: Caps | null,
      areaProgramatica: number,
      tipoCaps: string,
      ) {
        super(nombre, domicilio, telefono, estado, observacion, region, localidad, distribucionesHorarias, 
          legajosUdo, legajos, servicios, notificaciones, autoridades, registrosActividades, registroMensual, ddjjs, registrosPendientes);
        this.cabecera = cabecera;
        this.areaProgramatica = areaProgramatica;
        this.tipoCaps = tipoCaps;
      }
    
    }
    