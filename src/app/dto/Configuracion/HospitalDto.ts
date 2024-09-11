import { EfectorDto } from "./EfectorDto";

export class HospitalDto extends EfectorDto {
  nivelComplejidad: number;
  porcentajePorZona: number;
  esCabecera: boolean;
  admitePasiva: boolean;

  constructor(
      nombre: string,
      domicilio: string,
      region: number,
      localidad: number,
      nivelComplejidad: number,
      porcentajePorZona: number,
      esCabecera: boolean,
      admitePasiva: boolean,
  ) {
    super(nombre, domicilio, region, localidad);
    this.nivelComplejidad = nivelComplejidad;
    this.porcentajePorZona = porcentajePorZona;
    this.esCabecera = esCabecera;
    this.admitePasiva = admitePasiva;
  }
}