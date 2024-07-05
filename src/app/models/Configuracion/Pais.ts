export class Pais {
  id?: number;
  nombre: string;
  nacionalidad: string;
  codigo: string;


  constructor(
    nombre: string,
    nacionalidad: string,
    codigo: string
   
   ) {
    this.nombre = nombre;
    this.nacionalidad = nacionalidad;
    this.codigo = codigo;
   
  }
}
