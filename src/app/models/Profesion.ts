export class Profesion {
    id?: number;
    asistencial: boolean;
    nombre: string;
  
    constructor(asistencial: boolean, nombre: string) {
      this.asistencial = asistencial;
      this.nombre = nombre;
    }
  }
  