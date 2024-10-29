import { EfectorSummaryDto } from "../efector/EfectorSummaryDto";

export class PersonBasicPanelDto{
    id: number;
    nombre: string;
    apellido: string;
    udo: EfectorSummaryDto;
    efectores: EfectorSummaryDto[];
  
    constructor(
        id: number,
        nombre: string,
        apellido: string,
        udo: EfectorSummaryDto,
        efectores: EfectorSummaryDto[]
             
        ) {
        this.id = id;
        this.nombre = nombre;
        this.apellido = apellido;
        this.udo = udo;
        this.efectores = efectores
    }
}