export class Person {
    id?: number;
    nombre: string;
    apellido: string;
    dni: number;
    cuil: string;
    fechaNacimiento: Date;
    sexo: string;
    estado: boolean;

    constructor(nombre: string, apellido: string, dni: number, cuil: string, fechaNacimiento: Date, sexo: string, estado: boolean) {
        this.nombre = nombre;
        this.apellido = apellido;
        this.dni = dni;
        this.cuil = cuil;
        this.fechaNacimiento = fechaNacimiento;
        this.sexo = sexo;
        this.estado = estado;
    }

  }