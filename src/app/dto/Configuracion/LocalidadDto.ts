export class LocalidadDto {

    nombre : string;
    idDepartamento : number;
    activo : boolean;
    idEfectores : number[];

    constructor(
        nombre : string,
        idDepartamento : number,
        activo : boolean,
        idEfectores : number[]
    ){
        this.nombre = nombre;
        this.idDepartamento = idDepartamento;
        this.activo = activo;
        this.idEfectores = idEfectores;
    }
    
}
