import { PersonDto } from "./PersonDto";

export class AsistencialDto extends PersonDto {

    constructor(
        nombre: string,
        apellido: string,
        dni: number,
        cuil: string,
        fechaNacimiento: Date,
        email: string,
        esAsistencial: boolean,
        activo: boolean,
        sexo?: string,
        telefono?: string,
        domicilio?: string,
    ) {
        super(nombre, apellido, dni, cuil, fechaNacimiento, email, esAsistencial, activo, sexo, telefono, domicilio);
    }

}