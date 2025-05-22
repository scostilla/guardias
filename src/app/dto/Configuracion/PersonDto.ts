export class PersonDto {
  id?: number;
  nombre: string;
  apellido: string;
  dni: number;
  cuil: string;
  fechaNacimiento: Date;
  sexo?: string;
  telefono?: string;
  email: string;
  domicilio?: string;
  esAsistencial: boolean;
  activo: boolean;
  idHabilitacionesGuardias?: number[]


  constructor(
    nombre: string,
    apellido: string,
    dni: number,
    cuil: string,
    fechaNacimiento: Date,
    esAsistencial: boolean,
    activo: boolean,
    email: string,
    sexo?: string,
    telefono?: string,
    domicilio?: string,
    idHabilitacionesGuardias?: number[],
    id?: number,
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
    this.idHabilitacionesGuardias = idHabilitacionesGuardias;
  }
}
