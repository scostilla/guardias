export class ProvinciaDto {
    nombre: string;
    gentilicio: string;
    idPais: number;


constructor(nombre: string, gentilicio: string, idPais: number) {
    this.nombre = nombre;
    this.gentilicio = gentilicio;
    this.idPais = idPais;
}
}
