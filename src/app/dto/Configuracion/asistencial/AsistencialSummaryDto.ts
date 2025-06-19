export class AsistencialSummaryDto {

    id:number;
    nombre: string;
    apellido: string;
    cuil: string;
    profesion: string;
    nombresTiposGuardias: string[];
    idEfector: number;

    constructor(
        id: number,
        nombre: string,
        apellido: string,
        cuil: string,
        profesion: string,    
        nombresTiposGuardias: string[]=[],
        idEfector: number
    ) {
        this.id = id;
        this.nombre = nombre;
        this.apellido = apellido;
        this.cuil = cuil;
        this.profesion = profesion;
        this.nombresTiposGuardias = nombresTiposGuardias;
        this.idEfector = idEfector;
    }

}