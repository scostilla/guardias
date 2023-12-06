export class Departamento {
    id?: number;
    codigo_postal: number;
    nombre: string;
    id_provincia: number;


constructor(codigo_postal: number, nombre: string, id_provincia: number) {
    this.codigo_postal = codigo_postal;
    this.nombre = nombre;
    this.id_provincia = id_provincia;
}
}
