export class NuevoUsuario{
    
    nombreUsuario: string;
    password: string;
    roles: string[];
    idPerson: number;
    
    constructor( nombreUsuario: string, password: string, roles:string[], idPerson: number) {
        
        this.nombreUsuario = nombreUsuario;
        this.password = password;
        this.roles = roles;
        this.idPerson = idPerson;
    }

}