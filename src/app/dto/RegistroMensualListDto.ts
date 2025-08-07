import { AsistencialListForRmensualDto } from './guardias/AsistencialListForRmensualDto';
import { RegActivListDto } from './guardias/RegActivListDto';
import { SumaHorasListDto } from './guardias/SumaHorasListDto';

export class RegistroMensualListDto {
    id: number;
    mes: string;
    anio: number;
    asistencial: AsistencialListForRmensualDto;
    registroActividad: RegActivListDto[];
    totalHoras: SumaHorasListDto;

    constructor (
        id: number,
        mes: string,
        anio: number,
        asistencial: AsistencialListForRmensualDto,
        registroActividad: RegActivListDto[],
        totalHoras: SumaHorasListDto
    ){
        this.id = id;
        this.mes = mes;
        this.anio= anio;
        this.asistencial = asistencial;
        this.registroActividad = registroActividad;
        this.totalHoras = totalHoras;
    }
}