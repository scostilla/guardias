export class DepartamentoDto {

nombre: string;
codigoPostal: string;
activo: boolean;
idProvincia: number;
idLocalidades: number[];

    constructor(
    nombre: string,
    codigoPostal: string,
    activo: boolean,
    idProvincia: number,
    idLocalidades: number[]
    ){
    this.nombre = nombre;
    this.codigoPostal = codigoPostal;
    this.activo = activo;
    this.idProvincia = idProvincia;
    this.idLocalidades = idLocalidades;
    }
}
