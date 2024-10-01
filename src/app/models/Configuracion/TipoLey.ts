export class TipoLey {
    descripcion: string; // Requerido
    activo: boolean; // Opcional
    //idLeyes?: number[]; // Opcional
  
    constructor(
      descripcion: string,
      activo: boolean = true,
      //idLeyes?: number[]
    ) {
      this.descripcion = descripcion;
      this.activo = activo;
      //this.idLeyes = idLeyes;
    }
  }