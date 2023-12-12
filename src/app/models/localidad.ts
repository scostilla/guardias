import { Departamento } from "./Departamento";

export class Localidad {
    id?: number;
    nombre: string;
    departamento: Departamento;


constructor(nombre: string, departamento: Departamento) {
    this.nombre = nombre;
    this.departamento = departamento;
}
}
