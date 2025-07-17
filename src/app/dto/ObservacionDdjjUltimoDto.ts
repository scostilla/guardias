export class ObservacionDdjjUltimoDto {
    id: number;
    motivo: string;
    nombreUsuario: string;
    apellidoUsuario: string;
    
    constructor(
        id: number,
        motivo: string,
        nombreUsuario: string,
        apellidoUsuario: string,
    ) {
        
        this.id = id;
        this.motivo = motivo;
        this.nombreUsuario = nombreUsuario;
        this.apellidoUsuario = apellidoUsuario;
    }

}