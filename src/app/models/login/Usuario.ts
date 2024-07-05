import { Person } from "../Configuracion/Person";

export class Usuario {

    nombre: string;
    nombreUsuario: string;
    email: string;
    password: string;
    person:Person;
   // authorities: string[]; no lo necesito va a crear con rol user por defecto el backend
    
    constructor(nombre: string, nombreUsuario: string, email: string, password: string, person: Person) {
        this.nombre = nombre;
        this.nombreUsuario = nombreUsuario;
        this.email = email;
        this.password = password;
        this.person = person;
        //this.authorities = authorities;
    }
}
