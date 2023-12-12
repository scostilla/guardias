export class Provincia {
    id?: number;
    gentilicio: string;
    nombre: string;
    id_pais: number;


constructor(gentilicio: string, nombre: string, id_pais: number) {
    this.gentilicio = gentilicio;
    this.nombre = nombre;
    this.id_pais = id_pais;
}
}
