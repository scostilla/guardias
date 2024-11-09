import { Profesion } from "./Profesion";
import { Legajo } from "./Legajo";

export class Especialidad {
    id?: number;
    nombre: string;
    esPasiva: boolean;
    activo: boolean;
    profesion: Profesion;
    legajos: Legajo[]; 
  
    constructor(
      nombre: string,
      esPasiva: boolean,
      activo: boolean,
      profesion: Profesion,
      legajos: Legajo[],
    ) {
      this.nombre = nombre;
      this.esPasiva = esPasiva;
      this.activo = activo;
      this.profesion = profesion;
      this.legajos = legajos;
    }
  }
  