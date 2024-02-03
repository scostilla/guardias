export class Profesion {
    id?: number;
    asistencial: number;
    nombre: string;
  
    constructor(codigo: string, asistencial: number, nombre: string) {
      this.asistencial = asistencial;
      this.nombre = nombre;
    }
  }
  