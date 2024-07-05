import { Pais } from './Pais';

export class Provincia {
    id?: number;
    nombre: string;
    gentilicio: string;
    pais: Pais;


constructor(nombre: string, gentilicio: string, pais: Pais) {
    this.nombre = nombre;
    this.gentilicio = gentilicio;
    this.pais = pais;
}
}
