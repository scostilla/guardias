import { Person } from "./Person";

export class Asistencial extends Person {

    tipoGuardia: string;

    constructor(nombre: string, apellido: string, dni: number, cuil: string, fechaNacimiento: Date, sexo: string, telefono: string, email: string, domicilio: string, estado: boolean, tipoGuardia: string) {
        super(nombre, apellido, dni, cuil, fechaNacimiento, sexo, telefono, email, domicilio, estado);
        this.tipoGuardia = tipoGuardia;
    }

  }
