export class AutoridadImagenDto {
    url: string;
    personaName: string;
    cargo: string;
    
    constructor( url: string, personaName: string, cargo:string) {
        
        this.url = url;
        this.personaName = personaName;
        this.cargo = cargo;
    }

}