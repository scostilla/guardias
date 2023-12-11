import { Pais } from './Pais';
export class Provincia {
    id?: number;
    gentilicio: string;
    nombre: string;
    pais: Pais;


constructor(gentilicio: string, nombre: string, pais: Pais) {
    this.gentilicio = gentilicio;
    this.nombre = nombre;
    this.pais = pais;
}
}
