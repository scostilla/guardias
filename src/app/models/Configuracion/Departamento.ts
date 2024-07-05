import { Provincia } from './Provincia';

export class Departamento {
  map(arg0: (departamento: any) => any): any {
    throw new Error('Method not implemented.');
  }
  id?: number;
  nombre: string;
  codigoPostal: string;
  provincia: Provincia;
  

  constructor(
   nombre: string,
    codigoPostal: string,
    provincia: Provincia,
   

  ) {

    this.nombre = nombre;
    this.codigoPostal = codigoPostal;
    this.provincia = provincia;
   
  }
}
