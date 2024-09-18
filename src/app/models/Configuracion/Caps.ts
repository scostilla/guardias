import { Efector } from "./Efector";
import { Hospital } from "./Hospital";
import { Localidad } from "./Localidad";
import { Region } from "./Region";
import { Ddjj } from "./Ddjj";
import { DistribucionHoraria } from "./DistribucionHoraria";
import { Legajo } from "./Legajo";
import { Servicio } from "./Servicio";
import { Autoridad } from "./Autoridad";
import { RegistroActividad } from "../RegistroActividad";
import { RegistroMensual } from "../RegistroMensual";
import { RegistrosPendientes } from "../RegistrosPendientes";


export class Caps extends Efector {
    cabecera: Hospital;
    areaProgramatica: number;
    tipoCaps: string;
    
    constructor(
      nombre: string,
      domicilio: string,
      telefono: string,
      estado: boolean,
      observacion: string,
      porcentajePorZona: number,
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
      cabecera: Hospital, 
      areaProgramatica: number,
      tipoCaps: string,
      ) {
        super(nombre, domicilio, telefono, estado, observacion, porcentajePorZona, region, localidad, distribucionesHorarias, 
          legajosUdo, legajos, servicios, notificaciones, autoridades, registrosActividades, registroMensual, ddjjs, registrosPendientes);
        this.cabecera = cabecera;
        this.areaProgramatica = areaProgramatica;
        this.tipoCaps = tipoCaps;
      }
    
    }
    