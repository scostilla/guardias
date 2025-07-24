export class ObservacionDdjjDto {
    activo?: boolean;
    motivo: string;
    tipoDph: boolean;
    idUsuario: number;
    idDdjj: number;
    fechaCreacion?: string;
    horaCreacion?: string;
    
    constructor(
        motivo: string,
        tipoDph: boolean,
        idUsuario: number,
        idDdjj: number,
        activo?: boolean,
        fechaCreacion?: string,
        horaCreacion?: string
    ) {
        
        this.activo = activo;
        this.motivo = motivo;
        this.tipoDph = tipoDph;
        this.idUsuario = idUsuario;
        this.idDdjj = idDdjj;
        this.fechaCreacion = fechaCreacion;
        this.horaCreacion = horaCreacion;
    }

}