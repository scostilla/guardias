export class Profesion {
  id?: number;
  nombre: string;
  asistencial: boolean;
  activo: boolean;
  

  constructor(nombre: string, asistencial: boolean, activo: boolean) {
    this.nombre = nombre;
    this.asistencial = asistencial;
    this.activo = activo;
  }
}
