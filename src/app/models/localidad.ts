export class Localidad {
    id?: number;
    nombre: string;
    id_departamento: number;


constructor(nombre: string, id_departamento: number) {
    this.nombre = nombre;
    this.id_departamento = id_departamento;
}
}
