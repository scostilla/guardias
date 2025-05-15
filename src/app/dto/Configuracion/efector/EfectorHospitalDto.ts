export class EfectorHospitalDto {
    id:number;
    nombre: string;
    nivelComplejidad: number;

    constructor(
        id: number,
        nombre: string,
        nivelComplejidad: number,
    ) {
        this.id = id;
        this.nombre = nombre;
        this.nivelComplejidad = nivelComplejidad;
    }
}
