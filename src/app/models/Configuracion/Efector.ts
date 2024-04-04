import { Localidad } from "./Localidad";
import { Region } from "./Region";

export class Efector {
    id?: number;
    nombre: string;
    domicilio: string;
    telefono: string;
    estado: boolean;
    observacion: string;
    region: Region;
    localidad: Localidad;
  
    constructor(
        nombre: string,
        domicilio: string,
        telefono: string,
        estado: boolean,
        observacion: string,
        region: Region,
        localidad: Localidad
    ) {
        this.nombre = nombre;
        this.domicilio = domicilio;
        this.telefono = telefono;
        this.estado = estado;
        this.observacion = observacion;
        this.region = region;
        this.localidad = localidad;
    }
  }