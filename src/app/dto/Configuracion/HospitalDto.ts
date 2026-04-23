import { EfectorDto } from "./EfectorDto";

export class HospitalDto extends EfectorDto {
  esCabecera: boolean;
  admitePasiva: boolean;
  nivelComplejidad: number;
  idServicios?: number[];
  
  

  constructor(
      nombre: string,
      domicilio: string,
      idRegion: number,
      idLocalidad: number,
      telefono: string,
      observacion: string,
      url: string,
      esCabecera: boolean,
      admitePasiva: boolean,
      nivelComplejidad: number,
      idServicios?: number[]
  ) {
    super(nombre, domicilio, idRegion, idLocalidad, telefono, observacion, url);
    this.esCabecera = esCabecera;
    this.admitePasiva = admitePasiva;
    this.nivelComplejidad = nivelComplejidad;
    this.idServicios = idServicios || [];
  }
}