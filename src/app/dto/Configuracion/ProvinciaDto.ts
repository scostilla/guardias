export class ProvinciaDto {
    gentilicio: string;
    nombre: string;
    idPais: number;


constructor(gentilicio: string, nombre: string, idPais: number) {
    this.gentilicio = gentilicio;
    this.nombre = nombre;
    this.idPais = idPais;
}
}
