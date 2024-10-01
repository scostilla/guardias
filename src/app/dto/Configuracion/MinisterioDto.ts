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
      porcentajePorZona: number,
      idCabecera: number,
  ) {
    super(nombre, domicilio, idRegion, idLocalidad, telefono, observacion, porcentajePorZona);
    this.idCabecera = idCabecera;
  }
}