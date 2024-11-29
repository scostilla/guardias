import { Provincia } from './Provincia';

export class Departamento {
  id?: number;
  nombre: string;
  codigoPostal: string;
  provincia: Provincia;

  constructor(nombre: string, codigoPostal: string, provincia: Provincia) {
    this.nombre = nombre;
    this.codigoPostal = codigoPostal;
    this.provincia = provincia;
  }
}
