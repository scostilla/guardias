import { Adicional } from "./Adicional";
import { CargaHoraria } from "./CargaHoraria";
import { Categoria } from "./Categoria";
import { TipoRevista } from "./TipoRevista";

export class Revista {
    id?: number;
    tipoRevista: TipoRevista; //obligatorio
    categoria: Categoria; //obligatorio
    adicional?: Adicional | null; //opcional
    cargaHoraria: CargaHoraria; //obligatorio
    agrupacion: string; //obligatorio
  
    constructor(tipoRevista: TipoRevista, categoria: Categoria, adicional: Adicional, cargaHoraria: CargaHoraria,  agrupacion: string) {
      this.tipoRevista = tipoRevista;
      this.categoria = categoria;
    this.adicional = adicional;
      this.cargaHoraria = cargaHoraria;
      this.agrupacion = agrupacion;
    }
  }
  