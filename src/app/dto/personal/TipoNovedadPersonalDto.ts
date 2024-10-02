export class TipoNovedadPersonalDto {
    nombre: string; //requerido
    ley: string; //requerido
    articulo: string;
    inciso: string;
    idNovedadesPersonales: number[];

    constructor(
        nombre: string,
        ley: string,
        articulo: string,
        inciso: string,
        idNovedadesPersonales: number[],
            ){
        this.nombre = nombre;
        this.ley = ley;
        this.articulo = articulo;
        this.inciso = inciso;
        this.idNovedadesPersonales = idNovedadesPersonales;
    }
}
