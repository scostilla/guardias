export class AsistencialSummaryDto {

    id:number;
    nombre: string;
    apellido: string;
    nombresTiposGuardias: string[];

    constructor(
        id: number,
        nombre: string,
        apellido: string,
        nombresTiposGuardias: string[]=[]
    ) {
        this.id = id;
        this.nombre = nombre;
        this.apellido = apellido;
        this.nombresTiposGuardias = nombresTiposGuardias;
    }

}