export class Pais {
    id?: number;
    codigo: string;
    nacionalidad: string;
    nombre: string;


constructor(codigo: string, nacionalidad: string, nombre: string) {
    this.codigo = codigo;
    this.nacionalidad = nacionalidad;
    this.nombre = nombre;
}
}
