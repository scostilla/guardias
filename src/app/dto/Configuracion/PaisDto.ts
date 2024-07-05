export class PaisDto {
    nombre: string;
    nacionalidad: string;
    codigo: string;
    activo: boolean;

    constructor(
        nombre: string, 
        nacionalidad: string, 
        codigo: string, 
        activo: boolean
    ) {
    this.nombre = nombre;
    this.nacionalidad = nacionalidad;
    this.codigo = codigo;
    this.activo = activo;
    }
}
