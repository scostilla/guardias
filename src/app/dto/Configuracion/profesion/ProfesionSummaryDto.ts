import { EspecialidadSummaryDto } from "../especialidad/EspecialidadSummaryDto";

export class ProfesionSummaryDto {

    id:number;
    nombre: string;
    nombresEspecialidades: EspecialidadSummaryDto[];

    constructor( id: number, nombre:string, nombresEspecialidades: EspecialidadSummaryDto[]){
        this.id = id;
        this.nombre = nombre;
        this.nombresEspecialidades = nombresEspecialidades;
        }
}