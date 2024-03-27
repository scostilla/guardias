import { Provincia } from './Provincia';

export class Departamento {
  id?: number;
  codigoPostal: string;
  nombre: string;
  provincia: Provincia;

  constructor(codigoPostal: string, nombre: string, provincia: Provincia) {
    this.codigoPostal = codigoPostal;
    this.nombre = nombre;
    this.provincia = provincia;
  }
}
