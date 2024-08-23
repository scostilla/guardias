import { Efector } from "./Efector";
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


export class Hospital extends Efector {
    esCabecera: boolean;
    nivelComplejidad: number;
    admitePasiva: boolean;
    porcentajePorZona: number;
    
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
      esCabecera: boolean, 
      nivelComplejidad: number,
      admitePasiva: boolean,
      porcentajePorZona: number,
      ) {
        super(nombre, domicilio, telefono, estado, observacion, region, localidad, distribucionesHorarias, 
          legajosUdo, legajos, servicios, notificaciones, autoridades, registrosActividades, registroMensual, ddjjs, registrosPendientes);
        this.esCabecera = esCabecera;
        this.nivelComplejidad = nivelComplejidad;
        this.admitePasiva = admitePasiva;
        this.porcentajePorZona = porcentajePorZona;

      }
    
    }
    