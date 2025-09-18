import { LegajoListDto } from './LegajoListDto';
import { NovedadPersonalListDto } from './NovedadPersonalListDto';

export class AsistencialListForRmensualDto {
    id: number;
    apellido: string;
    nombre: string;
    dni: number;
    cuil: string;
    legajos: LegajoListDto[];
    novedadesPersonales: NovedadPersonalListDto[];

    constructor (
        id: number,
        apellido: string,
        nombre: string,
        dni: number,
        cuil: string,
        legajos: LegajoListDto[],
        novedadesPersonales: NovedadPersonalListDto[],
    ){
        this.id = id;
        this.apellido = apellido;
        this.nombre = nombre;
        this.dni = dni;
        this.cuil = cuil;
        this.legajos = legajos;
        this.novedadesPersonales = novedadesPersonales;
    }
}