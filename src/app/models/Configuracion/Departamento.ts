import { Provincia } from './Provincia';

export class Departamento {
  map(arg0: (departamento: any) => any): any {
    throw new Error('Method not implemented.');
  }
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
