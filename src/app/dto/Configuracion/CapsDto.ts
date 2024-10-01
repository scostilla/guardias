import { EfectorDto } from "./EfectorDto";

export class CapsDto extends EfectorDto {
  idCabecera: number;
  areaProgramatica: number;
  tipoCaps: string;
  
  

  constructor(
      nombre: string,
      domicilio: string,
      idRegion: number,
      idLocalidad: number,
      telefono: string,
      observacion: string,
      porcentajePorZona: number,
      idCabecera: number,
      areaProgramatica: number,
      tipoCaps: string
  ) {
    super(nombre, domicilio, idRegion, idLocalidad, telefono, observacion, porcentajePorZona);
    this.idCabecera = idCabecera;
    this.areaProgramatica = areaProgramatica;
    this.tipoCaps = tipoCaps;
  }
}