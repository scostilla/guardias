import { Especialidad } from "./Especialidad";
import { Legajo } from './Legajo';

export class Profesion {
  id?: number;
  nombre: string;
  asistencial: boolean;
  activo: boolean;
  especialidades: Especialidad[];
  legajos: Legajo[];
  

  constructor(
    nombre: string,
    asistencial: boolean,
    activo: boolean,
    especialidades: Especialidad[],
    legajos: Legajo[],

  ) {
    this.nombre = nombre;
    this.asistencial = asistencial;
    this.activo = activo;
    this.especialidades = especialidades;
    this.legajos = legajos;
  }
}
