import { Localidad } from "./Localidad";
import { Region } from "./Region";

export class Hospital {
    id?: number;
    domicilio: string;
    estado: number;
    localidad: Localidad;
    region: Region;
    nombre: string;
    observacion: string;
    telefono: number;
    esCabecera: number;
    nivelComplejidad: number;



constructor(domicilio: string, estado: number, localidad: Localidad, region: Region, nombre: string, observacion: string, telefono: number, esCabecera: number, nivelComplejidad: number) {
    this.domicilio = domicilio;
    this.estado = estado;
    this.localidad = localidad;
    this.region = region;
    this.nombre = nombre;
    this.observacion = observacion;
    this.telefono = telefono;
    this.esCabecera = esCabecera;
    this.nivelComplejidad = nivelComplejidad;

}
}
