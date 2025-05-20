export class AsistencialDetailDto {
    id:number;
    nombre: string;
    apellido: string;
    cuil: string;

    constructor(
        id: number,
        nombre: string,
        apellido: string,
        cuil: string
    ) {
        this.id = id;
        this.nombre = nombre;
        this.apellido = apellido;
        this.cuil = cuil;
    }

}