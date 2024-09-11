
export class EfectorDto {
    //id?: number;
    nombre: string;
    domicilio: string;
    //region: number;
    idRegion: number;
    //localidad: number;
    idLocalidad: number;
    porcentajePorZona: number;
  
    constructor(
        nombre: string,
        domicilio: string,
        idRegion: number,
        idLocalidad: number,
        porcentajePorZona: number,
    ) {
        this.nombre = nombre;
        this.domicilio = domicilio;
        this.idRegion = idRegion;
        this.idLocalidad = idLocalidad;
        this.porcentajePorZona = porcentajePorZona;
    }
  }