export class TipoLey {
    id?: number; // Opcional
    descripcion: string; // Requerido
    activo: boolean; // Opcional
    //idLeyes?: number[]; // Opcional
  
    constructor(
      descripcion: string,
      activo: boolean ,
      //idLeyes?: number[]
    ) {
      this.descripcion = descripcion;
      this.activo = activo;
      //this.idLeyes = idLeyes;
    }
  }