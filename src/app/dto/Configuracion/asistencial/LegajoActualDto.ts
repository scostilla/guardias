export class LegajoActualDto {
    nombreAdicional:string;
    nombreCategoria: string;
    nombreTipoRevista: string;

    constructor(
        nombreAdicional: string,
        nombreCategoria: string,
        nombreTipoRevista: string,
    ) {
        this.nombreAdicional = nombreAdicional;
        this.nombreCategoria = nombreCategoria;
        this.nombreTipoRevista = nombreTipoRevista;
    }

}