export class DepartamentoDto {
    nombre: string;
    codigoPostal: string;
    idProvincia: number;

    constructor(nombre: string, codigoPostal: string, idProvincia: number) {
        this.nombre = nombre;
        this.codigoPostal = codigoPostal;
        this.idProvincia = idProvincia;
    }
}
