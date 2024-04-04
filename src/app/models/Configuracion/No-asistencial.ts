import { Person } from "./Person";

export class NoAsistencial extends Person {

    descripcion: string;

    constructor(nombre: string, apellido: string, dni: number, cuil: string, fechaNacimiento: Date, sexo: string, telefono: string, email: string, domicilio: string, estado: boolean, descripcion: string) {
        super(nombre, apellido, dni, cuil, fechaNacimiento, sexo, telefono, email, domicilio, estado);
        this.descripcion = descripcion;
    }

  }
