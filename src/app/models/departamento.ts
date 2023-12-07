export class Departamento {
    id?: number;
    codigoPostal: string;
    nombre: string;
    id_provincia: number;


constructor(codigoPostal: string, nombre: string, id_provincia: number) {
    this.codigoPostal = codigoPostal;
    this.nombre = nombre;
    this.id_provincia = id_provincia;
}
}
