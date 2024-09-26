export class Profesional{
    idPersona?: number;
    nombre: string;
    apellido: string;
    dni: number;
    
    constructor(nombre:string, apellido:string, dni:number) {
        this.nombre=nombre;
        this.apellido=apellido;
        this.dni=dni;
    }
}