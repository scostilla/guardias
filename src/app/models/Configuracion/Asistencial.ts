export class Asistencial {
    id?: number;
    nombre: string;
    apellido: string;
    dni: number;
    domicilio: string;
    email: string;
    estado: boolean;
    cuil: string;
    fechaNacimiento: Date;
    sexo: string;
    telefono: number;
    idTipoGuardia: number;
    tipoGuardia: string;

    constructor(nombre: string, apellido: string, dni: number,  domicilio: string, email: string, estado: boolean, cuil: string, fechaNacimiento: Date, sexo: string, telefono: number, idTipoGuardia: number, tipoGuardia: string) {
        this.nombre = nombre;
        this.apellido = apellido;
        this.dni = dni;
        this.domicilio = domicilio;
        this.email = email;
        this.estado = estado;
        this.cuil = cuil;
        this.fechaNacimiento = fechaNacimiento;
        this.sexo = sexo;
        this.telefono = telefono;
        this.idTipoGuardia = idTipoGuardia;
        this.tipoGuardia = tipoGuardia;
    }

  }