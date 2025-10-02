import { AsistencialListForRmensualDto } from './guardias/AsistencialListForRmensualDto';
import { RegActivListDto } from './guardias/RegActivListDto';
import { SumaHorasListDto } from './guardias/SumaHorasListDto';
import { FacturaDetailDto } from './FacturaDetailDto';

export class RegistroMensualListDto {
    id: number;
    mes: string;
    anio: number;
    asistencial: AsistencialListForRmensualDto;
    registroActividad: RegActivListDto[];
    totalHoras: SumaHorasListDto;
    idDdjj: number;
    quincena?: string;
    estadoFacturacion?: string;
    facturas?: FacturaDetailDto[];

    constructor (
        id: number,
        mes: string,
        anio: number,
        asistencial: AsistencialListForRmensualDto,
        registroActividad: RegActivListDto[],
        totalHoras: SumaHorasListDto,
        idDdjj: number,
        quincena?: string,
        estadoFacturacion?: string,
        facturas?: FacturaDetailDto[],
    ){
        this.id = id;
        this.mes = mes;
        this.anio= anio;
        this.asistencial = asistencial;
        this.registroActividad = registroActividad;
        this.totalHoras = totalHoras;
        this.idDdjj = idDdjj;
        this.quincena = quincena;
        this.estadoFacturacion = estadoFacturacion;
        this.facturas = facturas;
    }
}