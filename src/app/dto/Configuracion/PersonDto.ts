export class PersonDto {
    
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
    /* idNovedadesPersonales?: number;
    idSuplentes?: number;
    idDistribucionesHorarias?: number;
    idAutoridades?: number;
    idLegajos?: number;  */   
  
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
        /* idNovedadesPersonales: number,
        idSuplentes: number,
        idDistribucionesHorarias: number,
        idAutoridades: number,
        idLegajos: number,     */          
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
       /*  this.idNovedadesPersonales = idNovedadesPersonales;
        this.idSuplentes = idSuplentes;
        this.idDistribucionesHorarias = idDistribucionesHorarias;
        this.idAutoridades = idAutoridades;
        this.idLegajos = idLegajos; */
    }
  
  }