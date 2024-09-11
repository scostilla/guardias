import { EfectorDto } from "./EfectorDto";

export class HospitalDto extends EfectorDto {
  esCabecera: boolean;
  admitePasiva: boolean;
  nivelComplejidad: number;
  //porcentajePorZona: number;
  
  

  constructor(
      nombre: string,
      domicilio: string,
      idRegion: number,
      idLocalidad: number,
      porcentajePorZona: number,
      esCabecera: boolean,
      admitePasiva: boolean,
      nivelComplejidad: number
  ) {
    super(nombre, domicilio, idRegion, idLocalidad,porcentajePorZona);
    this.esCabecera = esCabecera;
    this.admitePasiva = admitePasiva;
    this.nivelComplejidad = nivelComplejidad;
    /* this.porcentajePorZona = porcentajePorZona; */
  }
}