export class RevistaDto{

    idTipoRevista: number;
    idCategoria : number;
    idAdicional: number;
    idCargaHoraria: number;
    agrupacion: string;

    constructor(
        idTipoRevista: number,
        idCategoria : number,
        idAdicional: number,
        idCargaHoraria: number,
        agrupacion: string,
    ){
        this.idTipoRevista = idTipoRevista;
        this.idCategoria = idCategoria;
        this.idAdicional = idAdicional;
        this.idCargaHoraria = idCargaHoraria;
        this.agrupacion = agrupacion;
    }
}