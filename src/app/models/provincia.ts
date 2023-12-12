export class Provincia {
    id?: number;
    gentilicio: string;
    nombre: string;
<<<<<<< HEAD
    idPais: number;


constructor(gentilicio: string, nombre: string, idPais: number) {
    this.gentilicio = gentilicio;
    this.nombre = nombre;
    this.idPais = idPais;
=======
    pais: Pais;


constructor(gentilicio: string, nombre: string, id_pais: number) {
    this.gentilicio = gentilicio;
    this.nombre = nombre;
    this.pais = pais;
}
>>>>>>> 5d29fa30cc9dabf9fd07b15effaed6c1533724af
}
}
