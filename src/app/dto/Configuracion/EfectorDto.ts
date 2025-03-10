
export class EfectorDto {
    nombre: string;
    domicilio: string;
    idRegion: number;
    idLocalidad: number;
    telefono: string;
    observacion: string;
  
    constructor(
        nombre: string,
        domicilio: string,
        idRegion: number,
        idLocalidad: number,
        telefono: string,
        observacion: string,
    ) {
        this.nombre = nombre;
        this.domicilio = domicilio;
        this.idRegion = idRegion;
        this.idLocalidad = idLocalidad;
        this.telefono = telefono;
        this.observacion = observacion;
    }
  }