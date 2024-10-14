import { EfectorSummaryDto } from "../efector/EfectorSummaryDto";

export class PersonBasicPanelDto{
    nombre: string;
    apellido: string;
    udo: EfectorSummaryDto;
    efectores: EfectorSummaryDto[];
  
    constructor(
        nombre: string,
        apellido: string,
        udo: EfectorSummaryDto,
        efectores: EfectorSummaryDto[]
             
        ) {
        this.nombre = nombre;
        this.apellido = apellido;
        this.udo = udo;
        this.efectores = efectores
    }
}