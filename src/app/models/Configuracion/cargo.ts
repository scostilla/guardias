import { Legajo } from "./Legajo";

export class Cargo {
    id: number;
    nombre: string;
    descripcion: string;
    nroresolucion: string;
    nrodecreto: string;
    activo: boolean;
    fechaResolucion: Date;
    fechaInicio: Date;
    fechaFinal: Date;
    legajo: Legajo;
    agrupacion: string;
  
    constructor(
      id: number,
      nombre: string,
      descripcion: string,
      nroresolucion: string,
      nrodecreto: string,
      activo: boolean,
      fechaResolucion: Date,
      fechaInicio: Date,
      fechaFinal: Date,
      legajo: Legajo,
      agrupacion: string
    ) {
      this.id = id;
      this.nombre = nombre;
      this.descripcion = descripcion;
      this.nroresolucion = nroresolucion;
      this.nrodecreto = nrodecreto;
      this.activo = activo;
      this.fechaResolucion = fechaResolucion;
      this.fechaInicio = fechaInicio;
      this.fechaFinal = fechaFinal;
      this.legajo = legajo;
      this.agrupacion = agrupacion;
    }
  }