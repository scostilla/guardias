
export class Cargo {
    id?: number;
    nombre: string;
    descripcion: string;
    activo: boolean;
    constructor(
     
      nombre: string,
      descripcion: string,
      activo: boolean,
    ) {
      this.nombre = nombre;
      this.descripcion = descripcion;
      this.activo = activo;
    }
  }