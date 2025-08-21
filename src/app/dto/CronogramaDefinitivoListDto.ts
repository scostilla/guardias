import { DdjjListDto } from './DdjjListDto';


export class CronogramaDefinitivoListDto {
    id: boolean;
    mes: string;
    anio: number;
    ddjjs: DdjjListDto;
    
    constructor(
        id: boolean,
        mes: string,
        anio: number,
        ddjjs: DdjjListDto,
    ) {
        
        this.id = id;
        this.mes = mes;
        this.anio = anio;
        this.ddjjs = ddjjs;
    }

}