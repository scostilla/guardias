import { Legajo } from "src/app/models/Configuracion/Legajo";

export class AsistencialEfectorDto {
    id: number;
    nombre: string;
    apellido: string;
    dni: number;
    cuil: string;
    fechaNacimiento: string | null;
    sexo: string | null;
    telefono: string | null;
    email: string | null;
    domicilio: string | null;
    esAsistencial: boolean | null;
    activo: boolean;
    idLegajos: Legajo[];
  
    constructor(
      id: number,
      nombre: string,
      apellido: string,
      dni: number,
      cuil: string,
      fechaNacimiento: string | null,
      sexo: string | null,
      telefono: string | null,
      email: string | null,
      domicilio: string | null,
      esAsistencial: boolean | null,
      activo: boolean,
      idLegajos: Legajo[],
    ) {
      this.id = id;
      this.nombre = nombre;
      this.apellido = apellido;
      this.dni = dni;
      this.cuil = cuil;
      this.fechaNacimiento = fechaNacimiento;
      this.sexo = sexo;
      this.telefono = telefono;
      this.email = email;
      this.domicilio = domicilio;
      this.esAsistencial = esAsistencial;
      this.activo = activo;
      this.idLegajos = idLegajos
    }
}