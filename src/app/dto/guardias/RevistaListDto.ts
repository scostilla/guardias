import { TipoRevistaListDto } from './TipoRevistaListDto';
import { CategoriaListDto } from './CategoriaListDto';
import { AdicionalListDto } from './AdicionalListDto';

export class RevistaListDto {
    tipoRevista: TipoRevistaListDto;
    categoria: CategoriaListDto;
    adicional: AdicionalListDto;

        constructor (
            tipoRevista: TipoRevistaListDto,
            categoria: CategoriaListDto,
            adicional: AdicionalListDto,
                ){
            this.tipoRevista = tipoRevista;
            this.categoria = categoria;
            this.adicional = adicional;
        }
    }
