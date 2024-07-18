export class PersonBasicPanelDto{
    nombre: string;
    apellido: string;
    nombreUdo: string;
    nombresEfectores: string[];
  
    constructor(
        nombre: string,
        apellido: string,
        nombreUdo: string,
        nombresEfectores: string[]
             
        ) {
        this.nombre = nombre;
        this.apellido = apellido;
        this.nombreUdo = nombreUdo;
        this.nombresEfectores = nombresEfectores
    }
}