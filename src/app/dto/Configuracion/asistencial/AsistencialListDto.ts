export class AsistencialListDto {

    id:number;
    nombre: string;
    apellido: string;
    dni: number;
    cuil: string;
    fechaNacimiento: Date;
    sexo: string;
    telefono: string;
    email: string;
    domicilio: string;
    nombresTiposGuardias: string[];

    constructor(
        id: number,
        nombre: string,
        apellido: string,
        dni: number,
        cuil: string,
        fechaNacimiento: Date,
        sexo: string,
        telefono: string,
        email: string,
        domicilio: string,
        nombresTiposGuardias:string[]
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
        this.nombresTiposGuardias = nombresTiposGuardias;
    }

}