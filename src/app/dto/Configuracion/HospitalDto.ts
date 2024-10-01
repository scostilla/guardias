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
      porcentajePorZona: number,
      esCabecera: boolean,
      admitePasiva: boolean,
      nivelComplejidad: number
  ) {
    super(nombre, domicilio, idRegion, idLocalidad, telefono, observacion, porcentajePorZona);
    this.esCabecera = esCabecera;
    this.admitePasiva = admitePasiva;
    this.nivelComplejidad = nivelComplejidad;
  }
}