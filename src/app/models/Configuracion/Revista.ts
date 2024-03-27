export class Revista {
    id?: number;
    idAdicional: number;
    idCargaHoraria: number;
    idCategoria: number;
    idTipoRevista: number;
    agrupacion: string;
  
    constructor(idAdicional: number, idCargaHoraria: number, idCategoria: number, idTipoRevista: number, agrupacion: string) {
      this.idAdicional = idAdicional;
      this.idCargaHoraria = idCargaHoraria;
      this.idCategoria = idCategoria;
      this.idTipoRevista = idTipoRevista;
      this.agrupacion = agrupacion;
    }
  }
  
