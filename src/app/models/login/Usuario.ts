import { Person } from '../../models/Configuracion/Person';
export class Usuario {

    id?: number;
    nombreUsuario: string;
    password: string;
    activo: boolean;
    primerLogueo: boolean;
    roles: string[];
    person: Person;
    
    constructor( nombreUsuario: string, password: string, activo: boolean, primerLogueo: boolean, roles:string[], person: Person) {
        
        this.nombreUsuario = nombreUsuario;
        this.password = password;
        this.activo = activo;
        this.primerLogueo = primerLogueo;
        this.roles = roles;
        this.person = person;
    }
}