import { EfectorDto } from "./EfectorDto";

export class HospitalDto extends EfectorDto {
  esCabecera: boolean;
  admitePasiva: boolean;
  nivelComplejidad: number;
  
  

  constructor(
      nombre: string,
      domicilio: string,
      idRegion: number,
      idLocalidad: number,
      telefono: string,
      observacion: string,
      esCabecera: boolean,
      admitePasiva: boolean,
      nivelComplejidad: number
  ) {
    super(nombre, domicilio, idRegion, idLocalidad, telefono, observacion);
    this.esCabecera = esCabecera;
    this.admitePasiva = admitePasiva;
    this.nivelComplejidad = nivelComplejidad;
  }
}