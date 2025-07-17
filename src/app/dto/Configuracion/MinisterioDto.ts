import { EfectorDto } from "./EfectorDto";

export class MinisterioDto extends EfectorDto {
  idCabecera: number;
  
  

  constructor(
      nombre: string,
      domicilio: string,
      idRegion: number,
      idLocalidad: number,
      telefono: string,
      observacion: string,
      url: string,
      idCabecera: number,
  ) {
    super(nombre, domicilio, idRegion, idLocalidad, telefono, observacion, url);
    this.idCabecera = idCabecera;
  }
}