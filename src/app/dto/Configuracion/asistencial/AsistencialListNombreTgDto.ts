import { PersonDto } from "../PersonDto";

export class AsistencialListNombreTgDto extends PersonDto {
    idLegajos?: number[];
    nombresTiposGuardias: string[];

  constructor(
    nombre: string,
    apellido: string,
    dni: number,
    cuil: string,
    fechaNacimiento: Date,
    esAsistencial: boolean,
    activo: boolean,
    email: string,
    nombresTiposGuardias: string[],
    sexo?: string,
    telefono?: string,
    domicilio?: string,
    idLegajos?: number[],
    idHabilitacionesGuardias?: number[],
    id?: number,
  ) {
    super(
      nombre,
      apellido,
      dni,
      cuil,
      fechaNacimiento,
      esAsistencial,
      activo,
      email,
      sexo,
      telefono,
      domicilio,
      idHabilitacionesGuardias,
      id,
    );

    this.idLegajos = idLegajos;
    this.nombresTiposGuardias = nombresTiposGuardias;
  }
}
