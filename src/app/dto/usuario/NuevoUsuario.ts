export class NuevoUsuario{
    
    nombreUsuario: string;
    password: string;
    roles: string[];
    idPerson: number;
    activo?: boolean;
    primerLogueo?: boolean;
    
    constructor( nombreUsuario: string, password: string, roles:string[], idPerson: number, activo?: boolean, primerLogueo?: boolean) {
        
        this.nombreUsuario = nombreUsuario;
        this.password = password;
        this.roles = roles;
        this.idPerson = idPerson;
        this.activo = activo;
        this.primerLogueo = primerLogueo;
    }

}