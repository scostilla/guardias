import { Localidad } from "./Localidad";
import { Region } from "./Region";

export class Caps {
    id?: number;
    domicilio: string;
    estado: number;
    localidad: Localidad;
    region: Region;
    nombre: string;
    observacion: string;
    telefono: number;
    idUdo: number;
    tipoCaps: string;
    areaProgramatica: number;
    idCabecera: number;




constructor(domicilio: string, estado: number, localidad: Localidad, region: Region, nombre: string, observacion: string, telefono: number, idUdo: number, tipoCaps: string, areaProgramatica: number, idCabecera: number) {
    this.domicilio = domicilio;
    this.estado = estado;
    this.localidad = localidad;
    this.region = region;
    this.nombre = nombre;
    this.observacion = observacion;
    this.telefono = telefono;
    this.idUdo = idUdo;
    this.tipoCaps = tipoCaps;
    this.areaProgramatica = areaProgramatica;
    this.idCabecera = idCabecera;

}
}
