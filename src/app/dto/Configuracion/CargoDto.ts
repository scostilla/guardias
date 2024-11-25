export class CargoDto{
    nombre: string;
    descripcion: string;
    nroresolucion: string;
    nrodecreto: string;
    activo: boolean;
    fechaResolucion: Date;
    fechaInicio: Date;
    fechaFinal: Date;
    constructor(
      nombre: string,
      descripcion: string,
      nroresolucion: string,
      nrodecreto: string,
      activo: boolean,
      fechaResolucion: Date,
      fechaInicio: Date,
      fechaFinal: Date,
    ) {
      this.nombre = nombre;
      this.descripcion = descripcion;
      this.nroresolucion = nroresolucion;
      this.nrodecreto = nrodecreto;
      this.activo = activo;
      this.fechaResolucion = fechaResolucion;
      this.fechaInicio = fechaInicio;
      this.fechaFinal = fechaFinal;
   
    
    }
}