import { Legajo } from "./Legajo";

export class Person {
  id?: number;
  nombre: string;
  apellido: string;
  dni: number;
  cuil: string;
  fechaNacimiento: Date;
  sexo: string;
  telefono: string;
  email: string;
  domicilio: string;
  esAsistencial:boolean;
  activo: boolean; 
  legajos: Legajo[];

  constructor(
      nombre: string,
      apellido: string,
      dni: number,
      cuil: string,
      fechaNacimiento: Date,
      sexo: string,
      telefono: string,
      email: string,
      domicilio: string,
      esAsistencial:boolean,
      activo: boolean,
      legajos: Legajo[]
             
      ) {
      this.nombre = nombre;
      this.apellido = apellido;
      this.dni = dni;
      this.cuil = cuil;
      this.fechaNacimiento = fechaNacimiento;
      this.sexo = sexo;
      this.telefono = telefono;
      this.email = email;
      this.domicilio = domicilio;
      this.esAsistencial=esAsistencial;
      this.activo = activo;
      this.legajos = legajos;
  }

}