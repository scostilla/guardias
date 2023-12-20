export class Ministerio {
    id?: number;
    domicilio: string;
    estado: number;
    idLocalidad: number;
    idRegion: number;
    nombre: string;
    observacion: string;
    idCabecera: number;


constructor(domicilio: string, estado: number, idLocalidad: number, idRegion: number, nombre: string, observacion: string, idCabecera: number) {
    this.domicilio = domicilio;
    this.estado = estado;
    this.idLocalidad = idLocalidad;
    this.idRegion = idRegion;
    this.nombre = nombre;
    this.observacion = observacion;
    this.idCabecera = idCabecera;
}
}
