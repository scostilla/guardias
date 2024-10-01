import { RegistroActividad } from "../RegistroActividad";
import { RegistroMensual } from "../RegistroMensual";
import { RegistrosPendientes } from "../RegistrosPendientes";
import { Autoridad } from "./Autoridad";
import { Ddjj } from "./Ddjj";
import { DistribucionHoraria } from "./DistribucionHoraria";
import { Legajo } from "./Legajo";
import { Localidad } from "./Localidad";
import { Region } from "./Region";
import { Servicio } from "./Servicio";

export class Efector {
    id?: number;
    nombre: string;
    domicilio: string;
    telefono: string;
    estado: boolean;
    observacion: string;
    porcentajePorZona: number;
    region: Region;
    localidad: Localidad;
    distribucionesHorarias: DistribucionHoraria[];
    legajosUdo: Legajo[];
    legajos: Legajo[];
    servicios: Servicio[];
    notificaciones: Notification[];
    autoridades: Autoridad[];
    registrosActividades: RegistroActividad[];
    registroMensual: RegistroMensual[];
    ddjjs: Ddjj[];
    registrosPendientes: RegistrosPendientes[];
  
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
        registrosPendientes: RegistrosPendientes[]
    ) {
        this.nombre = nombre;
        this.domicilio = domicilio;
        this.telefono = telefono;
        this.estado = estado;
        this.observacion = observacion;
        this.porcentajePorZona = porcentajePorZona;
        this.region = region;
        this.localidad = localidad;
        this.distribucionesHorarias = distribucionesHorarias;
        this.legajosUdo = legajosUdo;
        this.legajos = legajos;
        this.servicios = servicios;
        this.notificaciones = notificaciones;
        this.autoridades = autoridades;
        this.registrosActividades = registrosActividades;
        this.registroMensual = registroMensual;
        this.ddjjs = ddjjs;
        this.registrosPendientes = registrosPendientes;
    }
  }