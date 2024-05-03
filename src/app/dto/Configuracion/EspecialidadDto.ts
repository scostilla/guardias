export class EspecialidadDto{
    nombre: string;
    idProfesion: number;
    esPasiva: boolean;
    activo: boolean;

    constructor(nombre: string, idProfesion:number, esPasiva:boolean,activo:boolean) {
        this.nombre = nombre;
        this.idProfesion = idProfesion;
        this.esPasiva = esPasiva;
        this.activo = activo;
    }
}