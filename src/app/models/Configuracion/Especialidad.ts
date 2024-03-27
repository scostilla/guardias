import { Profesion } from "./Profesion";

export class Especialidad {
    id?: number;
    esPasiva: boolean;
    nombre: string;
    profesion: Profesion;
  
    constructor(esPasiva: boolean, nombre: string, profesion: Profesion) {
      this.esPasiva = esPasiva;
      this.nombre = nombre;
      this.profesion = profesion;
    }
  }
  