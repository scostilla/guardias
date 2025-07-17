export class ObservacionDdjjDto {
    activo?: boolean;
    motivo: string;
    tipoDph: boolean;
    idUsuario: number;
    idDdjj: number;
    
    constructor(
        motivo: string,
        tipoDph: boolean,
        idUsuario: number,
        idDdjj: number,
        activo?: boolean,
    ) {
        
        this.activo = activo;
        this.motivo = motivo;
        this.tipoDph = tipoDph;
        this.idUsuario = idUsuario;
        this.idDdjj = idDdjj;
    }

}