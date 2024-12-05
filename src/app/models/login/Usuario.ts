import { Person } from '../../models/Configuracion/Person';
export class Usuario {

    id?: number;
    nombreUsuario: string;
    password: string;
    roles: string[];
    person: Person;

    rolesDisplay?: string;
    
    constructor( nombreUsuario: string, password: string, roles:string[], person: Person) {
        
        this.nombreUsuario = nombreUsuario;
        this.password = password;
        this.roles = roles;
        this.person = person;
    }
}