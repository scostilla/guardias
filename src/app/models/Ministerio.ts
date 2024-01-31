import { Localidad } from "./Localidad";
import { Region } from "./Region";


export class Ministerio {
    id?: number;
    domicilio: string;
    estado: boolean;
    localidad: Localidad;
    region: Region;
    nombre: string;
    observacion: string;
    telefono: number;
    idCabecera: number;


constructor(domicilio: string, estado: boolean, localidad: Localidad, region: Region, nombre: string, observacion: string, telefono: number, idCabecera: number) {
    this.domicilio = domicilio;
    this.estado = estado;
    this.localidad = localidad;
    this.region = region;
    this.nombre = nombre;
    this.observacion = observacion;
    this.telefono = telefono;
    this.idCabecera = idCabecera;
}
}
