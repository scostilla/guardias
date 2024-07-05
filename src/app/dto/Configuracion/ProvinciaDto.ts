export class ProvinciaDto {
    nombre: string;
    gentilicio: string;
    idPais: number;
    activo: boolean;


constructor(
    nombre: string,
    gentilicio: string,
    idPais: number,
    activo: boolean
) {
    this.nombre = nombre;
    this.gentilicio = gentilicio;
    this.idPais = idPais;
    this.activo = activo;
}
}
