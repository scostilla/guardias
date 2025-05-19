import { PersonDto } from "./PersonDto";

export class AsistencialDto extends PersonDto {
idLegajos?: number[];

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
    idLegajos?: number[],
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
      id,
    );

    this.idLegajos = idLegajos;
  }
}
