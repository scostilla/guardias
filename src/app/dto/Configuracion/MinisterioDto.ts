import { EfectorDto } from "./EfectorDto";

export class MinisterioDto extends EfectorDto {
  idCabecera: number;
  idServicios?: number[];
  
  

  constructor(
      nombre: string,
      domicilio: string,
      idRegion: number,
      idLocalidad: number,
      telefono: string,
      observacion: string,
      url: string,
      idCabecera: number,
      idServicios?: number[] 
  ) {
    super(nombre, domicilio, idRegion, idLocalidad, telefono, observacion, url);
    this.idCabecera = idCabecera;
    this.idServicios = idServicios || [];
  }
}