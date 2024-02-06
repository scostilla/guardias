import { Profesion } from "./Profesion";

export class Especialidad {
    id?: number;
    esPasiva: Boolean;
    nombre: string;
    profesion: Profesion;
  
    constructor(esPasiva: Boolean, nombre: string, profesion: Profesion) {
      this.esPasiva = esPasiva;
      this.nombre = nombre;
      this.profesion = profesion;
    }
  }
  