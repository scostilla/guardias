export class ObservacionDdjjUltimoDto {
    id: number;
    motivo: string;
    nombreUsuario: string;
    apellidoUsuario: string;
    fechaCreacion?: string;
    horaCreacion?: string;
    
    constructor(
        id: number,
        motivo: string,
        nombreUsuario: string,
        apellidoUsuario: string,
        fechaCreacion?: string,
        horaCreacion?: string
    ) {
        
        this.id = id;
        this.motivo = motivo;
        this.nombreUsuario = nombreUsuario;
        this.apellidoUsuario = apellidoUsuario;
        this.fechaCreacion = fechaCreacion;
        this.horaCreacion = horaCreacion;
    }

}