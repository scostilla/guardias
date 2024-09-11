
export class EfectorDto {
    id?: number;
    nombre: string;
    domicilio: string;
    region: number;
    localidad: number;
  
    constructor(
        nombre: string,
        domicilio: string,
        region: number,
        localidad: number,
    ) {
        this.nombre = nombre;
        this.domicilio = domicilio;
        this.region = region;
        this.localidad = localidad;
    }
  }