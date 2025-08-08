import { LegajoListDto } from './LegajoListDto';
import { NovedadPersonalListDto } from './NovedadPersonalListDto';

export class AsistencialListForRmensualDto {
    apellido: string;
    nombre: string;
    cuil: string;
    legajos: LegajoListDto[];
    novedadesPersonales: NovedadPersonalListDto[];

    constructor (
        apellido: string,
        nombre: string,
        cuil: string,
        legajos: LegajoListDto[],
        novedadesPersonales: NovedadPersonalListDto[],
    ){
        this.apellido = apellido;
        this.nombre = nombre;
        this.cuil = cuil;
        this.legajos = legajos;
        this.novedadesPersonales = novedadesPersonales;
    }
}