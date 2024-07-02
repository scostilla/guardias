export class LocalidadDto {

    nombre : string;
    idDepartamento : number;
    activo : boolean;

    constructor(
        nombre : string,
        idDepartamento : number,
        activo : boolean
    ){
        this.nombre = nombre;
        this.idDepartamento = idDepartamento;
        this.activo = activo;
    }
    
}
