export class Usuario {

    id?: number;
    nombreUsuario: string;
    email: string;
    password: string;
    roles: string[];
    
    constructor( nombreUsuario: string, email: string, password: string, roles:string[]) {
        
        this.nombreUsuario = nombreUsuario;
        this.email = email;
        this.password = password;
        this.roles = roles;
    }
}