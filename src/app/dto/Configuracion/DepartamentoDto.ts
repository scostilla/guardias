export class DepartamentoDto {
    nombre: string;
    codigoPostal: string;
    activo: boolean;
    idProvincia: number;


    constructor(
      nombre: string,
      codigoPostal: string,
      activo: boolean,
      idProvincia: number,

    ) {
      this.nombre = nombre;
      this.codigoPostal = codigoPostal;
      this.activo = activo;
      this.idProvincia = idProvincia;
    
    }
  }