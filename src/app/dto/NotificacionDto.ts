export class NotificacionDto {
    id?: number;
    tipo: string;
    categoria: string;
     detalle: string;
       url: string;
    fechaNotificacion: Date;
    fechaBaja: Date;
    activo: boolean;
    idEfectores: number[];

    constructor(
        tipo: string,
        categoria: string,
        detalle: string,
        url: string,
        fechaNotificacion: Date,
        fechaBaja: Date,
        activo: boolean,
        idEfectores: number[]
    ) {
        this.tipo = tipo;
        this.categoria = categoria;
        this.detalle = detalle;
        this.url = url;
        this.fechaNotificacion = fechaNotificacion;
        this.fechaBaja = fechaBaja;
        this.activo = activo;
        this.idEfectores = idEfectores;
    }

}