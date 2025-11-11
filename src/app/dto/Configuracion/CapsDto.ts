import { EfectorDto } from "./EfectorDto";

export class CapsDto extends EfectorDto {
  id?: number;
  idCabecera: number;
  areaProgramatica: number;
  tipoCaps: string;
  idServicios?: number[];
  
  

  constructor(
      nombre: string,
      domicilio: string,
      idRegion: number,
      idLocalidad: number,
      telefono: string,
      observacion: string,
      idServicio: number,
      url: string,
      idCabecera: number,
      areaProgramatica: number,
      tipoCaps: string,
      idServicios?: number[] // <-- opcional
  ) {
    super(nombre, domicilio, idRegion, idLocalidad,  telefono, observacion, idServicio, url);
    this.idCabecera = idCabecera;
    this.areaProgramatica = areaProgramatica;
    this.tipoCaps = tipoCaps;
    this.idServicios = idServicios || [];
  }
}