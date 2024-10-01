import { PersonDto } from "./PersonDto";

export class AsistencialDto extends PersonDto {

    idTiposGuardias: number[];

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
        esAsistencial: boolean,
        activo: boolean,
        idUsuario: number,
        idTiposGuardias: number[]
    ) {
        super(nombre, apellido, dni, cuil, fechaNacimiento, sexo, telefono, email, domicilio, esAsistencial, activo, idUsuario);
        this.idTiposGuardias = idTiposGuardias;
    }

}